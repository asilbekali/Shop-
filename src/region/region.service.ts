import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';

@Injectable()
export class RegionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createRegionDto: CreateRegionDto) {
    try {
      return await this.prisma.region.create({
        data: createRegionDto,
      });
    } catch (error) {
      throw new Error(`Failed to create region: ${error.message}`);
    }
  }

  async findAll({ page, limit, name, sortOrder }) {
    try {
      const skip = (page - 1) * limit;

      const regions = await this.prisma.region.findMany({
        where: {
          name: {
            contains: name,
            mode: 'insensitive',
          },
        },
        orderBy: {
          name: sortOrder,
        },
        skip,
        take: limit,
      });

      const total = await this.prisma.region.count({
        where: {
          name: {
            contains: name,
            mode: 'insensitive',
          },
        },
      });

      return {
        data: regions,
        total,
        page,
        limit,
      };
    } catch (error) {
      throw new Error(`Failed to retrieve regions: ${error.message}`);
    }
  }

  async findOne(id: number) {
    try {
      return await this.prisma.region.findUnique({
        where: { id },
      });
    } catch (error) {
      throw new Error(`Failed to find region with ID ${id}: ${error.message}`);
    }
  }

  async update(id: number, updateRegionDto: UpdateRegionDto) {
    try {
      return await this.prisma.region.update({
        where: { id },
        data: updateRegionDto,
      });
    } catch (error) {
      throw new Error(
        `Failed to update region with ID ${id}: ${error.message}`,
      );
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.region.delete({
        where: { id },
      });
    } catch (error) {
      throw new Error(
        `Failed to delete region with ID ${id}: ${error.message}`,
      );
    }
  }
}
