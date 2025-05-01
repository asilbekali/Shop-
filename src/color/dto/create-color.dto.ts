import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateColorDto {
  @IsString()
  @ApiProperty({
    description: 'Color name',
    example: 'red',
  })
  name: string;
}
