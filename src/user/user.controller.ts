import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiBody, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/register')
  @ApiBody({
    description: 'Register a new user',
    type: CreateUserDto,
  })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid data or user already exists',
  })
  async register(@Body() data: CreateUserDto) {
    return this.userService.register(data);
  }

  
  @Post('/verify')
  @ApiBody({
    description: 'OTP Verification',
    schema: {
      type: 'object',
      properties: {
        otp: { type: 'string', example: '123456' },
        email: { type: 'string', example: 'alex@gmail.com' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'OTP successfully verified and user status updated',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid OTP or OTP expired',
  })
  async verify(@Body() body: { otp: string; email: string }) {
    const { otp, email } = body;
    return this.userService.verify(email, otp);
  }

  
  @Post('/login')
  @ApiBody({
    description: 'Login credentials',
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'alex@gmail.com' },
        password: { type: 'string', example: 'StrongPassword_1' },
      },
    },
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid credentials',
  })
  async login(@Body() data: {email: string, password: string}) {
    const {email, password} = data
    return this.userService.login(email, password);
  }


}
