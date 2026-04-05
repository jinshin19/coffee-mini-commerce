// Packages
import { Transform } from "class-transformer";
import { IsBoolean, IsIn, IsOptional, IsString } from "class-validator";
// Utils
import { toBoolean } from "../../../../common/utils";
import { PaginationQueryDTO } from "../../../../common/dto";

export class QueryOrdersDTO extends PaginationQueryDTO {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsIn(["all", "pending", "confirmed", "rejected"])
  status?: "all" | "pending" | "confirmed" | "rejected" = "all";

  @IsOptional()
  @IsIn(["gcash", "cod"])
  paymentMethod?: "gcash" | "cod";

  @IsOptional()
  @Transform(({ value }) => toBoolean(value))
  @IsBoolean()
  closed?: boolean;

  @IsOptional()
  @IsString()
  dateFrom?: string;

  @IsOptional()
  @IsString()
  dateTo?: string;

  @IsOptional()
  @IsIn(["name", "total", "createdAt", "status"])
  sortBy?: "name" | "total" | "createdAt" | "status" = "createdAt";

  @IsOptional()
  @IsIn(["asc", "desc"])
  sortOrder?: "asc" | "desc" = "desc";
}
