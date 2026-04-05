// Packages
import { Type } from "class-transformer";
import {
  IsIn,
  Min,
  Matches,
  IsArray,
  IsString,
  IsOptional,
  IsNotEmpty,
  ArrayMinSize,
  ValidateNested,
} from "class-validator";

export class CreateOrderDTO {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9+\-\s()]{7,20}$/)
  contactNumber!: string;

  @IsString()
  @IsNotEmpty()
  address!: string;

  @IsIn(["gcash", "cod"])
  paymentMethod!: "gcash" | "cod";

  @IsOptional()
  @IsString()
  proofOfPayment?: string | null;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDTO)
  items!: CreateOrderItemDTO[];
}

export class CreateOrderItemDTO {
  @IsString()
  @IsNotEmpty()
  productId!: string;

  @Type(() => Number)
  @Min(1)
  quantity!: number;
}
