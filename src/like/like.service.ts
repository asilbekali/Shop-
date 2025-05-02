import { Injectable } from '@nestjs/common';
import { CreateLikeDto } from './dto/create-like.dto';
import { UpdateLikeDto } from './dto/update-like.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LikeService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createLikeDto: CreateLikeDto, req: Request) {
    try {
      const userId = req['user']?.id;
      if (!userId) {
        throw new Error('User not authenticated');
      }

      // Mahsulot ID mavjudligini tekshirish
      const productExists = await this.prisma.product.findFirst({
        where: { id: createLikeDto.productId },
      });

      if (!productExists) {
        return {
          message: `Product with ID ${createLikeDto.productId} does not exist.`,
        };
      }

      // "Like" yaratish
      const createdLike = await this.prisma.like.create({
        data: {
          userId: userId,
          productId: createLikeDto.productId,
        },
      });

      return createdLike;
    } catch (error) {
      console.error('Error creating like:', error.message);
      throw new Error(`Failed to create like: ${error.message}`);
    }
  }

  async findAll(req: Request) {
    try {
      return await this.prisma.like.findMany({
        where: { userId: req['user'].id },
        include: {
          user: true,
          product: true,
        },
      });
    } catch (error) {
      console.error('Error retrieving likes:', error.message);
      throw new Error(`Failed to retrieve likes: ${error.message}`);
    }
  }

  async findOne(id: number) {
    try {
      const like = await this.prisma.like.findUnique({
        where: { id },
        include: {
          user: true,
          product: true,
        },
      });

      if (!like) {
        return { message: `Like with ID ${id} not found.` };
      }

      return like;
    } catch (error) {
      console.error('Error retrieving like:', error.message);
      throw new Error(`Failed to retrieve like: ${error.message}`);
    }
  }

  async update(id: number, updateLikeDto: UpdateLikeDto) {
    try {
      const updatedLike = await this.prisma.like.update({
        where: { id },
        data: updateLikeDto,
      });

      if (!updatedLike) {
        return { message: `Like with ID ${id} not found.` };
      }

      return updatedLike;
    } catch (error) {
      console.error('Error updating like:', error.message);
      throw new Error(`Failed to update like: ${error.message}`);
    }
  }

  async remove(id: number) {
    try {
      const removedLike = await this.prisma.like.delete({
        where: { id },
      });

      if (!removedLike) {
        return { message: `Like with ID ${id} not found.` };
      }

      return removedLike;
    } catch (error) {
      console.error('Error removing like:', error.message);
      throw new Error(`Failed to remove like: ${error.message}`);
    }
  }
}
