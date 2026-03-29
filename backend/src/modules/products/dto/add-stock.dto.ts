import { Transform } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class AddStockDto {
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  amount!: number;
}
