import { productStatus } from '@prisma/client';
import { IsNumber, isString, IsString } from 'class-validator';
import { TypeCategory } from 'src/category/enum/type.enum';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsNumber()
  categoryId: number;

  @IsString()
  type: TypeCategory;

  @IsString()
  status: productStatus;

  @IsNumber()
  count: number;

  @IsNumber()
  discount: number;

  @IsString()
  desc: string;

  @IsNumber()
  userId: number;

  @IsNumber()
  regionId: number;
}
