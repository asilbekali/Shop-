import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { ApiOperation, ApiResponse, ApiQuery, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { Role } from 'src/user/enum/roles.enum';
import { RoleDec } from 'src/user/decorator/roles.decorator';
import { RolesGuard } from 'src/roles/roles.guard';

@UseGuards(AuthGuard)
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @RoleDec(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new category' })
  @ApiResponse({ status: 201, description: 'Category successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiBody({
    description: 'The category data to create',
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'The name of the category',
          example: 'Electronics',
        },
        picture: {
          type: 'array',
          items: { type: 'string' },
          description: 'The list of picture URLs for the category',
          example: 'https://example.com/image1.jpg',
        },
        type: {
          type: 'string',
          enum: ['phones', 'laptops', 'accessories'],
          description: 'The type of the category',
          example: 'phones',
        },
      },
    },
  })
  create(@Body() data: any) {
    return this.categoryService.create(data);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all categories with optional filter and sorting',
  })
  @ApiResponse({ status: 200, description: 'List of all categories.' })
  @ApiQuery({
    name: 'filter',
    required: false,
    type: 'string',
    description: 'Filter categories by name',
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    type: 'string',
    enum: ['asc', 'desc'],
    description: 'Sort categories by name in ascending or descending order',
  })
  findAll(
    @Query('filter') filter?: string,
    @Query('sort') sort?: 'asc' | 'desc',
  ) {
    return this.categoryService.findAll(filter, sort);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific category by ID' })
  @ApiResponse({ status: 200, description: 'Category found.' })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(+id);
  }

  @Patch(':id')
  @RoleDec(Role.SUPER_ADMIN, Role.ADMIN)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Update a specific category by ID' })
  @ApiResponse({ status: 200, description: 'Category successfully updated.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiBody({
    description: 'The category data to update',
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'The name of the category',
          example: 'Updated Electronics',
        },
        picture: {
          type: 'array',
          items: { type: 'string' },
          description: 'The updated list of picture URLs for the category',
          example: 'https://example.com/image2.jpg',
        },
        type: {
          type: 'string',
          enum: ['phones', 'laptops', 'accessories'],
          description: 'The updated type of the category',
          example: 'accessories',
        },
      },
    },
  })
  update(@Param('id') id: string, @Body() updateCategoryDto: any) {
    return this.categoryService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  @RoleDec(Role.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Delete a category by ID' })
  @ApiResponse({ status: 200, description: 'Category successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id);
  }
}
