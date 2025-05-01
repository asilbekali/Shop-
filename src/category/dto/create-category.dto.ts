// import { ApiProperty } from '@nestjs/swagger';
// import {
//   IsEnum,
//   IsNotEmpty,
//   IsString,
//   IsUrl,
//   ArrayNotEmpty,
//   IsArray,
// } from 'class-validator';
import { TypeCategory } from '../enum/type.enum';

export class CreateCategoryDto {
  name: string;

  type: TypeCategory;

  picture: string;
}
