import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Max, Min } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ description: 'Product id', example: 1 })
  @IsInt({ message: 'Product ID must be an integer' })
  productId: number;

  @ApiProperty({ description: 'Comment text', example: 'This product is good!' })
  @IsString({ message: 'Text must be a string' })
  text: string;

  @ApiProperty({ description: 'Star rating', example: 5 })
  @IsInt({ message: 'Star rating must be an integer' })
  @Min(0, { message: 'Star rating must be at least 0' })
  @Max(5, { message: 'Star rating must be at most 5' })
  star: number;
}
