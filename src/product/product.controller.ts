import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query, 
  BadRequestException 
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiTags, ApiQuery } from '@nestjs/swagger';

@ApiTags('Products')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    try {
      return await this.productService.create(createProductDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get()
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'filter', required: false, example: 'name:Product1' })
  @ApiQuery({ name: 'sortBy', required: false, example: 'price' })
  @ApiQuery({ name: 'order', required: false, example: 'ASC | DESC' })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('filter') filter?: string,
    @Query('sortBy') sortBy?: string,
    @Query('order') order: 'ASC' | 'DESC' = 'ASC',
  ) {
    try {
      return await this.productService.findAll({ page, limit, filter, sortBy, order });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const productId = parseInt(id, 10);
      if (isNaN(productId)) {
        throw new BadRequestException('Invalid ID format');
      }
      return await this.productService.findOne(productId);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    try {
      const productId = parseInt(id, 10);
      if (isNaN(productId)) {
        throw new BadRequestException('Invalid ID format');
      }
      return await this.productService.update(productId, updateProductDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const productId = parseInt(id, 10);
      if (isNaN(productId)) {
        throw new BadRequestException('Invalid ID format');
      }
      return await this.productService.remove(productId);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
