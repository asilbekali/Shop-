import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    try {
      return await this.prisma.product.create({
        data: createProductDto,
      });
    } catch (error) {
      throw new BadRequestException(`Error creating product: ${error.message}`);
    }
  }

  async findAll({ page, limit, filter, sortBy, order }: { 
    page: number; 
    limit: number; 
    filter?: string; 
    sortBy?: string; 
    order: 'ASC' | 'DESC';
  }) {
    try {
      const skip = (page - 1) * limit;
      const where = filter 
        ? { [filter.split(':')[0]]: { contains: filter.split(':')[1] } }
        : {};
      const sortOrder = sortBy 
        ? { [sortBy]: order.toUpperCase() === 'ASC' ? 'asc' : 'desc' }
        : {};

      return await this.prisma.product.findMany({
        skip,
        take: limit,
        where,
        orderBy: sortOrder,
      });
    } catch (error) {
      throw new BadRequestException(`Error fetching products: ${error.message}`);
    }
  }

  async findOne(id: number) {
    try {
      const product = await this.prisma.product.findUnique({
        where: { id },
      });
      if (!product) {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }
      return product;
    } catch (error) {
      throw new BadRequestException(`Error fetching product: ${error.message}`);
    }
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    try {
      const product = await this.prisma.product.findUnique({
        where: { id },
      });
      if (!product) {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }
      return await this.prisma.product.update({
        where: { id },
        data: updateProductDto,
      });
    } catch (error) {
      throw new BadRequestException(`Error updating product: ${error.message}`);
    }
  }

  async remove(id: number) {
    try {
      const product = await this.prisma.product.findUnique({
        where: { id },
      });
      if (!product) {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }
      return await this.prisma.product.delete({
        where: { id },
      });
    } catch (error) {
      throw new BadRequestException(`Error deleting product: ${error.message}`);
    }
  }
}
