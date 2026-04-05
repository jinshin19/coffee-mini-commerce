// Utils
import { toBoolean } from "@src/common/utils";
// DTO's
import { PaginationQueryDTO } from "@src/common/dto";
// Packages
import { Transform } from "class-transformer";
import { IsBoolean, IsIn, IsOptional, IsString } from "class-validator";

export class QueryProductsDTO extends PaginationQueryDTO {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsIn(["all", "featured", "bestseller", "lowstock"])
  filter?: "all" | "featured" | "bestseller" | "lowstock" = "all";

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  origin?: string;

  @IsOptional()
  @IsString()
  roastLevel?: string;

  @IsOptional()
  @Transform(({ value }) => toBoolean(value))
  @IsBoolean()
  featured?: boolean;

  @IsOptional()
  @Transform(({ value }) => toBoolean(value))
  @IsBoolean()
  bestSeller?: boolean;

  @IsOptional()
  @IsIn(["all", "instock", "lowstock", "outofstock"])
  stockStatus?: "all" | "instock" | "lowstock" | "outofstock";

  @IsOptional()
  @IsIn(["name", "price", "stock", "createdAt", "updatedAt"])
  sortBy?: "name" | "price" | "stock" | "createdAt" | "updatedAt" = "updatedAt";

  @IsOptional()
  @IsIn(["asc", "desc"])
  sortOrder?: "asc" | "desc" = "desc";
}
