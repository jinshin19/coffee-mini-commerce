import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, SortOrder } from "mongoose";
import {
  buildContainsRegex,
  buildExactCaseInsensitiveRegex,
} from "../../common/utils/query.utils";
import { generateCoffeeId } from "../../common/utils/id.utils";
import { slugify } from "../../common/utils/slugify";
import { CreateProductDto } from "./dto/create-product.dto";
import { QueryProductsDto } from "./dto/query-products.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import {
  Product,
  ProductDocument,
  RoastLevelsT,
} from "./schemas/product.schema";
import { PaginationFieldsU } from "src/common/utils/mongodb-modifier.util";
import { PaginationService } from "src/common/services/pagination.service";
import { ResponseService } from "src/common/interfaces/response.interfaces";

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private readonly products: Model<ProductDocument>,
  ) {}

  async findAll(query: QueryProductsDto): Promise<ResponseService> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    let filterQuery: any = {};

    if (query.search?.trim()) {
      const regex = buildContainsRegex(query.search);
      filterQuery.$or = [
        { name: regex },
        { category: regex },
        { origin: regex },
        { roastLevel: regex },
        { slug: regex },
      ];
    }

    if (query.category?.trim()) {
      filterQuery.category = buildExactCaseInsensitiveRegex(query.category);
    }

    if (query.origin?.trim()) {
      filterQuery.origin = buildExactCaseInsensitiveRegex(query.origin);
    }

    if (query.roastLevel?.trim()) {
      filterQuery.roastLevel = buildExactCaseInsensitiveRegex(query.roastLevel);
    }

    if (typeof query.featured === "boolean") {
      filterQuery.featured = query.featured;
    }

    if (typeof query.bestSeller === "boolean") {
      filterQuery.bestSeller = query.bestSeller;
    }

    if (query.filter === "featured") {
      filterQuery.featured = true;
    }

    if (query.filter === "bestseller") {
      filterQuery.bestSeller = true;
    }

    if (query.filter === "lowstock" || query.stockStatus === "lowstock") {
      filterQuery.stock = { $lte: 10 };
    }

    if (query.stockStatus === "instock") {
      filterQuery.stock = { $gt: 0 };
    }

    if (query.stockStatus === "outofstock") {
      filterQuery.stock = { $lte: 0 };
    }

    const sortField = query.sortBy || "updatedAt";
    const sortOrder: SortOrder = query.sortOrder === "asc" ? 1 : -1;

    const [products, total] = await Promise.all([
      this.products.aggregate([
        { $match: filterQuery },
        ...PaginationFieldsU(page, limit, sortField, sortOrder),
      ]),
      this.products.countDocuments(filterQuery),
    ]);

    return {
      data: PaginationService({
        items: products[0]?.items,
        metadata: {
          ...products[0]?.metadata,
          count: total,
          totalPages: Math.ceil(total / products[0]?.metadata?.limit),
        },
      }),
    };
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.products.findOne({ _id: id }).lean();
    if (!product) {
      throw new NotFoundException(`Product ${id} was not found.`);
    }
    return product;
  }

  async create(body: CreateProductDto): Promise<Product> {
    const slug = body.slug?.trim() ? slugify(body.slug) : slugify(body.name);

    await this.ensureSlugAvailable(slug);

    const created = await this.products.create({
      id: generateCoffeeId(),
      slug,
      name: body.name.trim(),
      category: body.category.trim(),
      shortDescription: body.shortDescription.trim(),
      description: body.description.trim(),
      price: body.price,
      image: body.image.trim(),
      roastLevel: body.roastLevel.trim(),
      origin: body.origin.trim(),
      bestSeller: body.bestSeller,
      featured: body.featured,
      stock: body.stock,
    });

    return created.toObject();
  }

  async update(id: string, body: UpdateProductDto): Promise<Product> {
    const product = await this.products.findOne({ _id: id });
    if (!product) {
      throw new NotFoundException(`Product ${id} was not found.`);
    }

    if (body.slug || body.name) {
      const nextSlug = body.slug?.trim()
        ? slugify(body.slug)
        : slugify(body.name || product.name);
      await this.ensureSlugAvailable(nextSlug, product._id);
      product.slug = nextSlug;
    }

    if (body.name !== undefined) product.name = body.name.trim();
    if (body.category !== undefined) product.category = body.category.trim();
    if (body.shortDescription !== undefined)
      product.shortDescription = body.shortDescription.trim();
    if (body.description !== undefined)
      product.description = body.description.trim();
    if (body.price !== undefined) product.price = body.price;
    if (body.image !== undefined) product.image = body.image.trim();
    if (body.roastLevel !== undefined)
      product.roastLevel = body.roastLevel.trim() as RoastLevelsT;
    if (body.origin !== undefined) product.origin = body.origin.trim();
    if (body.featured !== undefined) product.featured = body.featured;
    if (body.bestSeller !== undefined) product.bestSeller = body.bestSeller;
    if (body.stock !== undefined) {
      if (body.stock < 0) {
        throw new BadRequestException("Stock cannot be negative.");
      }
      product.stock = body.stock;
    }

    await product.save();
    return product.toObject();
  }

  async addStock(id: string, amount: number): Promise<Product> {
    if (amount < 1) {
      throw new BadRequestException("Stock amount must be greater than zero.");
    }

    const product = await this.products.findOne({ _id: id });
    if (!product) {
      throw new NotFoundException(`Product ${id} was not found.`);
    }

    product.stock = product.stock + amount;
    await product.save();

    return product.toObject();
  }

  async removeStock(id: string, amount: number): Promise<Product> {
    if (amount < 1) {
      throw new BadRequestException(
        "Stock deduction amount must be greater than zero.",
      );
    }

    const product = await this.products.findOne({ _id: id });
    if (!product) {
      throw new NotFoundException(`Product ${id} was not found.`);
    }

    if (product.stock < amount) {
      throw new BadRequestException(
        `Not enough stock available for ${product.name}.`,
      );
    }

    product.stock -= amount;
    await product.save();

    return product.toObject();
  }

  async delete(id: string) {
    const deleted = await this.products.findOneAndDelete({ _id: id }).lean();
    if (!deleted) {
      throw new NotFoundException(`Product ${id} was not found.`);
    }

    return {
      message: `Product ${id} deleted successfully.`,
      id,
    };
  }

  async getDistinctFilters() {
    const [categories, origins, roastLevels] = await Promise.all([
      this.products.distinct("category"),
      this.products.distinct("origin"),
      this.products.distinct("roastLevel"),
    ]);

    return {
      categories: categories.sort(),
      origins: origins.sort(),
      roastLevels: roastLevels.sort(),
    };
  }

  private async ensureSlugAvailable(slug: string, excludeId?: string) {
    const existing = await this.products.findOne({
      slug,
      ...(excludeId ? { _id: { $ne: excludeId } } : {}),
    });

    if (existing) {
      throw new ConflictException(`Slug "${slug}" is already in use.`);
    }
  }
}
