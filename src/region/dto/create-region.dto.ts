import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRegionDto {
  @IsString()
  @ApiProperty({
    description: 'Region name',
    example: 'Ferghana',
  })
  @IsNotEmpty({ message: 'Region name is required' })
  @IsString({ message: 'Region name must be a string' })
  name: string;
}
