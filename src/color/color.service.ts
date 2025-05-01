import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ColorService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createColorDto: CreateColorDto) {
    try {
      const bazaColor = await this.prisma.color.findFirst({
        where: { name: createColorDto.name },
      });

      if (bazaColor) {
        throw new BadRequestException(
          `${createColorDto.name} this color already exists`,
        );
      }

      return await this.prisma.color.create({
        data: { name: createColorDto.name },
      });
    } catch (error) {
      throw error instanceof BadRequestException
        ? error
        : new InternalServerErrorException('Failed to create color');
    }
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    sort: 'asc' | 'desc' = 'asc',
    filterByName?: string,
  ) {
    try {
      const skip = (page - 1) * limit;

      const where = filterByName
        ? { name: { contains: filterByName, mode: 'insensitive' as const } }
        : undefined;

      const colors = await this.prisma.color.findMany({
        skip,
        take: limit,
        where,
        orderBy: { name: sort },
      });

      const total = await this.prisma.color.count({ where });

      return {
        total,
        page,
        limit,
        data: colors,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch colors');
    }
  }

  async findOne(id: number) {
    try {
      const color = await this.prisma.color.findUnique({ where: { id } });

      if (!color) {
        throw new BadRequestException(`Color with id ${id} not found`);
      }

      return color;
    } catch (error) {
      throw error instanceof BadRequestException
        ? error
        : new InternalServerErrorException('Failed to fetch color');
    }
  }

  async update(id: number, updateColorDto: UpdateColorDto) {
    try {
      const color = await this.prisma.color.findUnique({ where: { id } });

      if (!color) {
        throw new BadRequestException(`Color with id ${id} not found`);
      }

      return await this.prisma.color.update({
        where: { id },
        data: { ...updateColorDto },
      });
    } catch (error) {
      throw error instanceof BadRequestException
        ? error
        : new InternalServerErrorException('Failed to update color');
    }
  }

  async remove(id: number) {
    try {
      const color = await this.prisma.color.findUnique({ where: { id } });

      if (!color) {
        throw new BadRequestException(`Color with id ${id} not found`);
      }

      return await this.prisma.color.delete({ where: { id } });
    } catch (error) {
      throw error instanceof BadRequestException
        ? error
        : new InternalServerErrorException('Failed to delete color');
    }
  }
}
