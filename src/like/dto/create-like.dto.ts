import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLikeDto {
  @ApiProperty({
    description: 'The ID of the product being liked',
    example: 1,
  })
  @IsNumber()
  productId: number;

  
}
