import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsIn, IsNotEmpty, IsOptional, IsString, Matches, Min, ValidateNested } from 'class-validator';

export class CreateOrderItemDto {
  @IsString()
  @IsNotEmpty()
  productId!: string;

  @Type(() => Number)
  @Min(1)
  quantity!: number;
}

export class CreateOrderDto {
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

  @IsIn(['gcash', 'cod'])
  paymentMethod!: 'gcash' | 'cod';

  @IsOptional()
  @IsString()
  proofOfPayment?: string | null;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items!: CreateOrderItemDto[];
}
