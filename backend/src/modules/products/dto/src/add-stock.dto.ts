// Packages
import { IsInt, Min } from "class-validator";
import { Transform } from "class-transformer";

export class AddStockDTO {
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  amount!: number;
}
