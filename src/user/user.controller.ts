import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiBody, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { RoleUser, userStatus } from '@prisma/client';

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

  @Post('/register-admin')
  @ApiBody({
    description: 'Register a new admin user',
    type: CreateUserDto,
    examples: {
      'application/json': {
        value: {
          firstName: 'Admin',
          lastName: 'User',
          role: RoleUser['admin'],
          email: 'admin@example.com',
          password: 'AdminPassword123',
          picture: 'admin-picture.jpg',
          regionId: 'some-region-id',
          year: '2025',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Admin successfully registered',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid data or user already exists',
  })
  async registerAdmin(@Body() data: CreateUserDto) {
    return this.userService.register(data);
  }

  @Post('/verify')
  @ApiBody({
    description: 'OTP Verification',
    schema: {
      type: 'object',
      properties: {
        otp: { type: 'string', example: 123456 },
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
  async login(@Body() data: { email: string; password: string }) {
    const { email, password } = data;
    return this.userService.login(email, password);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  async me(@Request() req: any) {
    return this.userService.meUser(req.user);
  }

  // ----------------------------------------------------

  @Post('add-admin')
  @UseGuards(AuthGuard)
  @ApiBearerAuth() // To indicate this endpoint requires a token
  @ApiBody({
    description: 'Assign admin role to a user',
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'number', example: 123 },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'User successfully promoted to admin',
  })
  @ApiResponse({
    status: 403,
    description: 'Unauthorized access',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiTags('user')
  async addAdmin(@Request() req: any, @Body() body: { userId: number }) {
    return this.userService.addAdmin(body.userId, req.user);
  }

  @Get('all-users')
  async getAll() {
    return this.userService.getAllUser();
  }


  @Post("refresh-token")
  @ApiBody({
    description: 'Refresh token for update access token',
    schema: {
      type: 'object',
      properties: {
        refreshToken: { type: 'string', example: "woefenwoefowmwpoedpwodpwpdoe" },
      },
    },
  })
  async refreshToken(@Body() data: string){
    return this.userService.refreshToken(data)
  }
}
