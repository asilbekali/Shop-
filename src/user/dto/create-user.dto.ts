import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  Matches,
  Max,
  Min,
} from 'class-validator';
import { Role } from '../enum/roles.enum';

export class CreateUserDto {
  @ApiProperty({
    description: 'User first name',
    example: 'Alex',
  })
  @IsNotEmpty({ message: 'First name is required' })
  @IsString({ message: 'First name must be a string' })
  firstName: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Qodirov',
  })
  @IsNotEmpty({ message: 'Last name is required' })
  @IsString({ message: 'Last name must be a string' })
  lastName: string;

  @ApiProperty({
    description: 'User role',
    example: 'admin',
  })
  @IsNotEmpty({ message: 'Role is required' })
  @IsEnum(Role, { message: 'Role must be a valid enum value' })
  role: Role;

  @ApiProperty({
    description: 'User email address',
    example: 'alex@gmail.com',
  })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'StrongPassword_1',
  })
  @IsNotEmpty({ message: 'Password is required' })
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message:
      'Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character',
  })
  password: string;

  @ApiProperty({
    description: 'User region ID',
    example: 1,
  })
  @IsNotEmpty({ message: 'Region ID is required' })
  @IsInt({ message: 'Region ID must be an integer' })
  @Min(1, { message: 'Region ID must be at least 1' })
  regionId: number;

  @ApiProperty({
    description: 'User birth year',
    example: 2007,
  })
  @IsNotEmpty({ message: 'Year of birth is required' })
  @IsInt({ message: 'Year of birth must be an integer' })
  @Min(1900, { message: 'Year of birth must be at least 1900' })
  @Max(new Date().getFullYear(), {
    message: `Year of birth cannot be greater than the current year`,
  })
  year: number;

  @ApiProperty({
    description: 'User profile picture',
    example: 'user.png',
  })
  @IsNotEmpty({ message: 'Profile picture is required' })
  @IsString({ message: 'Profile picture must be a string' })
  picture: string;
}
