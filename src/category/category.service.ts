import {
  BadRequestException,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { TypeCategory } from './enum/type.enum';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCategoryDto) {
    try {
      if (Object.values(TypeCategory).includes(dto.type)) {
        return await this.prisma.category.create({
          data: {
            type: dto.type,
            name: dto.name,
            picture: String(dto.picture),
          },
        });
      } else {
        throw new BadRequestException(`${dto.type} is not valid!`);
      }
    } catch (error) {
      throw error instanceof BadRequestException
        ? error
        : new InternalServerErrorException('Failed to create category');
    }
  }

  async findAll(filter?: string, sort?: 'asc' | 'desc') {
    try {
      const whereCondition = filter ? { name: { contains: filter } } : {};
      const orderByCondition = sort ? { name: sort } : {};

      return await this.prisma.category.findMany({
        where: whereCondition,
        orderBy: orderByCondition,
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch categories');
    }
  }

  async findOne(id: number) {
    try {
      const category = await this.prisma.category.findUnique({
        where: { id },
      });

      if (!category) {
        throw new BadRequestException(`Category with ID ${id} not found!`);
      }

      return category;
    } catch (error) {
      throw error instanceof BadRequestException
        ? error
        : new InternalServerErrorException('Failed to fetch category');
    }
  }

  async update(id: number, updateCategoryDto: any) {
    try {
      const existingCategory = await this.prisma.category.findFirst({
        where: { id },
      });
      if (!existingCategory) {
        throw new BadRequestException(`Category with ID ${id} not found!`);
      }

      if (Object.values(TypeCategory).includes(updateCategoryDto.type)) {
        const { picture, ...rest } = updateCategoryDto;

        return await this.prisma.category.update({
          where: { id },
          data: {
            picture: picture ? String(picture) : existingCategory.picture,
            ...rest,
          },
        });
      } else {
        throw new NotFoundException(
          `Type not found. Only select from: ${[TypeCategory.CLOTHES, TypeCategory.ELECTRONICS, TypeCategory.PHONES, TypeCategory.SHOES]}`,
        );
      }
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update category');
    }
  }

  async remove(id: number) {
    try {
      const existingCategory = await this.prisma.category.findUnique({
        where: { id },
      });

      if (!existingCategory) {
        throw new BadRequestException(`Category with ID ${id} not found!`);
      }

      return await this.prisma.category.delete({
        where: { id },
      });
    } catch (error) {
      throw error instanceof BadRequestException
        ? error
        : new InternalServerErrorException('Failed to delete category');
    }
  }
}
