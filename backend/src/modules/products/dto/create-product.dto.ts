import { Transform } from "class-transformer";
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from "class-validator";
import { RoastLevelsC, RoastLevelsT } from "../schemas/product.schema";

export class CreateProductDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  slug?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  category!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(180)
  shortDescription!: string;

  @IsString()
  @IsOptional()
  description!: string;

  @Transform(({ value }) => Number(value))
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price!: number;

  @IsString()
  @IsNotEmpty()
  image!: string;

  @IsNotEmpty()
  @IsEnum(RoastLevelsC)
  roastLevel!: RoastLevelsT;

  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  origin!: string;

  @Transform(({ value }) => value === true || value === "true")
  @IsBoolean()
  bestSeller!: boolean;

  @Transform(({ value }) => value === true || value === "true")
  @IsBoolean()
  featured!: boolean;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(0)
  stock!: number;
}
