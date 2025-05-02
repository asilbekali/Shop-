import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCommentDto: CreateCommentDto, req: Request) {
    try {
      if (!req['user'] || !req['user'].id) {
        return {
          statusCode: 401,
          message: 'User not authenticated',
        };
      }

      if (isNaN(createCommentDto.productId)) {
        return {
          statusCode: 400,
          message: 'Product ID must be a number',
        };
      }

      const product = await this.prisma.product.findUnique({
        where: { id: createCommentDto.productId },
      });

      if (!product) {
        return {
          statusCode: 404,
          message: `Product with ID ${createCommentDto.productId} not found`,
        };
      }

      if (
        createCommentDto.star < 0 ||
        createCommentDto.star > 5 ||
        isNaN(createCommentDto.star)
      ) {
        return {
          statusCode: 400,
          message: 'Star rating must be a number between 0 and 5',
        };
      }

      const newComment = await this.prisma.comment.create({
        data: {
          userId: req['user'].id,
          productId: createCommentDto.productId,
          star: createCommentDto.star,
          text: createCommentDto.text,
        },
      });

      return {
        statusCode: 201,
        message: 'Comment created successfully',
        data: newComment,
      };
    } catch (error) {
      console.error(error);
      return {
        statusCode: 500,
        message: 'An internal server error occurred',
        error: error.message,
      };
    }
  }

  async findAll() {
    try {
      const comments = await this.prisma.comment.findMany();
      return {
        statusCode: 200,
        message: 'Comments fetched successfully',
        data: comments,
      };
    } catch (error) {
      console.error(error);
      return {
        statusCode: 500,
        message: 'An internal server error occurred',
        error: error.message,
      };
    }
  }

  async findOne(id: number) {
    try {
      if (isNaN(id)) {
        return {
          statusCode: 400,
          message: 'ID must be a number',
        };
      }

      const comment = await this.prisma.comment.findUnique({
        where: { id },
      });

      if (!comment) {
        return {
          statusCode: 404,
          message: 'Comment not found',
        };
      }

      return {
        statusCode: 200,
        message: 'Comment fetched successfully',
        data: comment,
      };
    } catch (error) {
      console.error(error);
      return {
        statusCode: 500,
        message: 'An internal server error occurred',
        error: error.message,
      };
    }
  }

  async update(id: number, updateCommentDto: UpdateCommentDto) {
    try {
      if (isNaN(id)) {
        return {
          statusCode: 400,
          message: 'Comment ID must be a number',
        };
      }

      const comment = await this.prisma.comment.findUnique({
        where: { id },
      });

      if (!comment) {
        return {
          statusCode: 404,
          message: `Comment with ID ${id} not found`,
        };
      }

      if (typeof updateCommentDto.productId !== 'number') {
        return {
          statusCode: 400,
          message: 'Product ID must be a number',
        };
      }

      const productExists = await this.prisma.product.findUnique({
        where: { id: updateCommentDto.productId },
      });

      if (!productExists) {
        return {
          statusCode: 404,
          message: `Product with ID ${updateCommentDto.productId} not found`,
        };
      }

      if (
        updateCommentDto.star &&
        (updateCommentDto.star < 0 ||
          updateCommentDto.star > 5 ||
          isNaN(updateCommentDto.star))
      ) {
        return {
          statusCode: 400,
          message: 'Star rating must be between 0 and 5',
        };
      }

      const updatedComment = await this.prisma.comment.update({
        where: { id },
        data: updateCommentDto,
      });

      return {
        statusCode: 200,
        message: 'Comment updated successfully',
        data: updatedComment,
      };
    } catch (error) {
      console.error(error);
      return {
        statusCode: 500,
        message: 'An internal server error occurred',
        error: error.message,
      };
    }
  }

  async remove(id: number) {
    try {
      if (isNaN(id)) {
        return {
          statusCode: 400,
          message: 'ID must be a number',
        };
      }

      const comment = await this.prisma.comment.findUnique({
        where: { id },
      });

      if (!comment) {
        return {
          statusCode: 404,
          message: `Comment with ID ${id} not found`,
        };
      }

      await this.prisma.comment.delete({
        where: { id },
      });

      return {
        statusCode: 200,
        message: 'Comment deleted successfully',
      };
    } catch (error) {
      console.error(error);
      return {
        statusCode: 500,
        message: 'An internal server error occurred',
        error: error.message,
      };
    }
  }
}
