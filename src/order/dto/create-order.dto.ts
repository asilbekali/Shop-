import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateOrderDto {
  @IsNumber()
  @ApiProperty({
    description: 'Product id',
    example: 1,
  })
  productId: number;

  @IsNumber()
  @ApiProperty({
    description: 'Color id',
    example: 1,
  })
  colorId: number;

  @IsNumber()
  @ApiProperty({
    description: 'Count id',
    example: 1,
  })
  count: number;
}
