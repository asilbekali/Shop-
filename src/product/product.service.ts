import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto, req: Request) {
    try {
      const userId = req['user'].id;
      const { regionId, categoryId } = createProductDto;

      const regionExists = await this.prisma.region.findUnique({
        where: { id: regionId },
      });

      if (!regionExists) {
        return { status: 404, message: 'Region not found' };
      }

      const categoryExists = await this.prisma.category.findUnique({
        where: { id: categoryId },
      });

      if (!categoryExists) {
        return { status: 404, message: 'Category not found' };
      }

      const bazaColor = await this.prisma.color.findFirst({
        where: { name: createProductDto.color },
      });

      if (!bazaColor) {
        return { status: 404, message: 'Color not found' };
      }

      const newPro = await this.prisma.product.create({
        data: { userId, ...createProductDto },
      });
      await this.prisma.productColor.create({
        data: { colorId: bazaColor.id, productId: newPro.id },
      });
      return newPro;
    } catch (error) {
      return { status: 500, message: 'Failed to create product' };
    }
  }

  async findAll(query: {
    page?: number;
    limit?: number;
    sortBy?: 'name' | 'regionName';
    sortOrder?: 'asc' | 'desc';
    filterByRegion?: string;
  }) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'name',
      sortOrder = 'asc',
      filterByRegion,
    } = query;

    try {
      if (filterByRegion) {
        const regionExists = await this.prisma.region.findUnique({
          where: { id: Number(filterByRegion) },
        });
        if (!regionExists) {
          return { status: 404, message: 'Region not found' };
        }
      }

      const products = await this.prisma.product.findMany({
        where: {
          regionId: filterByRegion
            ? { equals: Number(filterByRegion) }
            : undefined,
        },
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip: (page - 1) * limit,
        take: limit,

        include: {
          user: true,
        },
      });

      return products;
    } catch (error) {
      return { status: 500, message: 'Failed to fetch products' };
    }
  }

  async findOne(id: number, req: Request) {
    try {
      const product = await this.prisma.product.findUnique({
        where: { id },
        include: {
          user: true,
        },
      });

      if (!product) {
        return { status: 404, message: 'Product not found' };
      }

      const viewUser = await this.prisma.view.findFirst({
        where: { userId: req['user'].id },
      });
      if (!viewUser) {
        await this.prisma.view.create({
          data: { userId: req['user'].id, productId: product.id },
        });
      }

      return product;
    } catch (error) {
      return { status: 500, message: 'Error fetching product' };
    }
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    try {
      const productExists = await this.prisma.product.findUnique({
        where: { id },
      });

      if (!productExists) {
        return { status: 404, message: 'Product not found' };
      }

      const updatedProduct = await this.prisma.product.update({
        where: { id },
        data: updateProductDto,
      });

      return updatedProduct;
    } catch (error) {
      return { status: 500, message: 'Failed to update product' };
    }
  }

  async remove(id: number) {
    try {
      const productExists = await this.prisma.product.findUnique({
        where: { id },
      });

      if (!productExists) {
        return { status: 404, message: 'Product not found' };
      }

      const deletedProduct = await this.prisma.product.delete({
        where: { id },
      });

      return deletedProduct;
    } catch (error) {
      return { status: 500, message: 'Failed to delete product' };
    }
  }
}
