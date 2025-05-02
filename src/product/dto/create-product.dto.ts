import { productStatus } from '@prisma/client';
import { IsNotEmpty, IsNumber, IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TypeCategory } from 'src/category/enum/type.enum';

export class CreateProductDto {
  @ApiProperty({
    example: 'Sample Product',
    description: 'The name of the product',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 100, description: 'The price of the product' })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty({ example: 1, description: 'The category ID of the product' })
  @IsNotEmpty()
  @IsNumber()
  categoryId: number;

  @ApiProperty({ enum: TypeCategory, description: 'The type of the product' })
  @IsNotEmpty()
  @IsEnum(TypeCategory)
  type: TypeCategory;

  @ApiProperty({
    example: 'https://example.com/image.jpg',
    description: 'The picture URL of the product',
  })
  @IsNotEmpty()
  @IsString()
  picture: string;

  @ApiProperty({
    enum: productStatus,
    description: 'The status of the product',
  })
  @IsNotEmpty()
  @IsEnum(productStatus)
  status: productStatus;

  @ApiProperty({ example: 10, description: 'The count of products available' })
  @IsNotEmpty()
  @IsNumber()
  count: number;

  @ApiProperty({
    example: 15,
    description: 'The discount percentage for the product',
  })
  @IsNotEmpty()
  @IsNumber()
  discount: number;

  @ApiProperty({
    example: 'This is a great product.',
    description: 'The description of the product',
  })
  @IsNotEmpty()
  @IsString()
  desc: string;

  @ApiProperty({ example: 2, description: 'The region ID of the product' })
  @IsNotEmpty()
  @IsNumber()
  regionId: number;

  @ApiProperty({ example: 'Red', description: 'The color of the product' })
  @IsNotEmpty()
  @IsString()
  color: string;
}
