export const ProductRoastLevelsC = [
  "light",
  "medium-light",
  "medium",
  "medium-dark",
  "dark",
  "espresso",
] as const;
const ProductFiltersC = ["all", "featured", "bestseller", "lowstock"] as const;

// API Service
import { ApiService } from "../api.service";
// Models
import { ProductModelsC } from "@/services/models";
// Next Imports
import { HTTP_METHOD } from "next/dist/server/web/http";
// Service Handlers
import {
  ResponseHandlerI,
  ResponseHandlerService,
  ErrorResponseHandlerService,
} from "@/services/handlers";

export class ProductsService {
  constructor(private readonly apiService: ApiService) {}

  public async getProducts({
    page,
    limit,
    search,
    filter,
  }: GetProductsI): Promise<ResponseHandlerI> {
    const response = await this.apiService.UseApi({
      url: ProductModelsC.getProducts.url,
      method: ProductModelsC.getProducts.method as HTTP_METHOD,
      params: {
        query: {
          page,
          limit,
          search,
          filter,
        },
      },
    });

    if (response instanceof ErrorResponseHandlerService) {
      return ResponseHandlerService({
        success: false,
        httpCode: response.status,
        message: response.message,
        error: {
          url: response.url,
          method: response.method,
        },
      });
    }

    const { data } = await response;

    return ResponseHandlerService(data);
  }

  public async getProductById({
    id,
  }: GetProductById): Promise<ResponseHandlerI> {
    const response = await this.apiService.UseApi({
      url: ProductModelsC.getProducts.url,
      method: ProductModelsC.getProducts.method as HTTP_METHOD,
      params: {
        id,
      },
    });

    if (response instanceof ErrorResponseHandlerService) {
      return ResponseHandlerService({
        success: false,
        httpCode: response.status,
        message: response.message,
        error: {
          url: response.url,
          method: response.method,
        },
      });
    }

    const { data } = await response;

    return ResponseHandlerService(data);
  }

  public async createProduct(
    params: CreateProductPayloadI,
  ): Promise<ResponseHandlerI> {
    const response = await this.apiService.UseApi({
      url: ProductModelsC.createProduct.url,
      method: ProductModelsC.createProduct.method as HTTP_METHOD,
      body: params,
    });

    if (response instanceof ErrorResponseHandlerService) {
      return ResponseHandlerService({
        success: false,
        httpCode: response.status,
        message: response.message,
        error: {
          url: response.url,
          method: response.method,
        },
      });
    }

    const { data } = await response;

    return ResponseHandlerService(data);
  }

  public async updateProductById(
    id: string,
    params: UpdateProductPayloadI,
  ): Promise<ResponseHandlerI> {
    const response = await this.apiService.UseApi({
      url: ProductModelsC.updateProductById.url,
      method: ProductModelsC.updateProductById.method as HTTP_METHOD,
      params: { id },
      body: params,
    });

    if (response instanceof ErrorResponseHandlerService) {
      return ResponseHandlerService({
        success: false,
        httpCode: response.status,
        message: response.message,
        error: {
          url: response.url,
          method: response.method,
        },
      });
    }

    const { data } = await response;

    return ResponseHandlerService(data);
  }

  public async restockProductById(
    id: string,
    params: UpdateProductStockPayloadI,
  ): Promise<ResponseHandlerI> {
    const response = await this.apiService.UseApi({
      url: ProductModelsC.restockProductById.url,
      method: ProductModelsC.restockProductById.method as HTTP_METHOD,
      params: {
        id,
      },
      body: {
        amount: params.stock,
      },
    });

    if (response instanceof ErrorResponseHandlerService) {
      return ResponseHandlerService({
        success: false,
        httpCode: response.status,
        message: response.message,
        error: {
          url: response.url,
          method: response.method,
        },
      });
    }

    const { data } = await response;

    return ResponseHandlerService(data);
  }

  public async deleteProductById(id: string): Promise<ResponseHandlerI> {
    const response = await this.apiService.UseApi({
      url: ProductModelsC.deleteProductById.url,
      method: ProductModelsC.deleteProductById.method as HTTP_METHOD,
      params: {
        id,
      },
    });

    if (response instanceof ErrorResponseHandlerService) {
      return ResponseHandlerService({
        success: false,
        httpCode: response.status,
        message: response.message,
        error: {
          url: response.url,
          method: response.method,
        },
      });
    }

    const { data } = await response;

    return ResponseHandlerService(data);
  }
}

export interface ProductI {
  _id?: string;
  id: string;
  slug: string;
  name: string;
  category: string;
  shortDescription: string;
  description: string;
  price: number;
  image: string;
  roastLevel: ProductRoastLevelsT;
  origin: string;
  bestSeller: boolean;
  featured: boolean;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

export type GetProductsFilterT = (typeof ProductFiltersC)[number];
export type ProductRoastLevelsT = (typeof ProductRoastLevelsC)[number];

export interface GetProductsI {
  page: number;
  limit: number;
  search: string;
  filter: GetProductsFilterT;
}

export interface GetProductById {
  id: string;
}

export type CreateProductPayloadI = Partial<Pick<ProductI, "slug">> &
  Pick<
    ProductI,
    | "name"
    | "category"
    | "shortDescription"
    | "description"
    | "price"
    | "image"
    | "roastLevel"
    | "origin"
    | "bestSeller"
    | "featured"
    | "stock"
  >;

export interface UpdateProductPayloadI extends Partial<CreateProductPayloadI> {}

export type UpdateProductStockPayloadI = Pick<CreateProductPayloadI, "stock">;

export interface ProductFormValuesI {
  name: string;
  slug: string;
  category: string;
  shortDescription: string;
  description: string;
  price: string;
  image: string;
  roastLevel: ProductRoastLevelsT;
  origin: string;
  featured: boolean;
  bestSeller: boolean;
  stock: string;
}
