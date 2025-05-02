import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
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
      console.error('Error creating region:', error);
      throw new HttpException(
        'Failed to create region. Please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll({ page = 1, limit = 10, name = '', sortOrder = 'asc' }) {
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
          name: sortOrder as 'asc' | 'desc', // SortOrder sifatida aniq belgilash
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
      console.error('Error retrieving regions:', error);
      throw new HttpException(
        'Failed to retrieve regions. Please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: number) {
    try {
      const region = await this.prisma.region.findUnique({
        where: { id },
      });

      if (!region) {
        throw new HttpException('Region not found', HttpStatus.NOT_FOUND);
      }

      return region;
    } catch (error) {
      console.error(`Error finding region with ID ${id}:`, error);
      throw new HttpException(
        'Failed to find the region. Please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  
  async update(id: number, updateRegionDto: UpdateRegionDto) {
    try {
      const updatedRegion = await this.prisma.region.update({
        where: { id },
        data: updateRegionDto,
      });

      return updatedRegion;
    } catch (error) {
      console.error(`Error updating region with ID ${id}:`, error);

      if (error.code === 'P2025') {
        throw new HttpException('Region not found', HttpStatus.NOT_FOUND);
      }

      throw new HttpException(
        'Failed to update the region. Please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: number) {
    try {
      const deletedRegion = await this.prisma.region.delete({
        where: { id },
      });

      return deletedRegion;
    } catch (error) {
      console.error(`Error deleting region with ID ${id}:`, error);

      if (error.code === 'P2025') {
        throw new HttpException('Region not found', HttpStatus.NOT_FOUND);
      }

      if (error.code === 'P2003') {
        throw new HttpException(
          'Cannot delete the region as it is linked to other records.',
          HttpStatus.CONFLICT,
        );
      }

      throw new HttpException(
        'Failed to delete the region. Please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
