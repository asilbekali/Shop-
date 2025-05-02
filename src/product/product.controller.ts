import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Request, 
  Query, 
  UseGuards 
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiQuery, ApiBody } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({ status: 201, description: 'The product has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  create(@Body() createProductDto: CreateProductDto, @Request() req: Request) {
    return this.productService.create(createProductDto, req);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all products with pagination, sorting, and filtering' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number for pagination' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items per page' })
  @ApiQuery({ name: 'sortBy', required: false, type: String, description: 'Field to sort by (name or regionName)' })
  @ApiQuery({ name: 'sortOrder', required: false, type: String, enum: ['asc', 'desc'], description: 'Sort order (asc or desc)' })
  @ApiQuery({ name: 'filterByRegion', required: false, type: String, description: 'Filter products by region name' })
  @ApiResponse({ status: 200, description: 'List of products' })
  findAll(
    @Query() query: {
      page?: number;
      limit?: number;
      sortBy?: 'name' | 'regionName';
      sortOrder?: 'asc' | 'desc';
      filterByRegion?: string;
    },
  ) {
    return this.productService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product details by ID' })
  @ApiResponse({ status: 200, description: 'Product details' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  findOne(@Param('id') id: string, @Request() req: Request) {
    return this.productService.findOne(+id, req);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update product details by ID' })
  @ApiBody({ type: UpdateProductDto })
  @ApiResponse({ status: 200, description: 'The product has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product by ID' })
  @ApiResponse({ status: 200, description: 'The product has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
