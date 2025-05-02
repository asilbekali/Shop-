import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto, req: Request) {
    try {
      if (!req['user'] || !req['user'].id) {
        return { message: 'User is not authenticated', success: false };
      }
      const bazaProduct = await this.prisma.product.findFirst({
        where: { id: createOrderDto.productId },
      });

      if (!bazaProduct) {
        return { message: 'Product not found', success: false };
      }

      const bazaColor = await this.prisma.color.findFirst({
        where: { id: createOrderDto.colorId },
      });

      if (!bazaColor) {
        return { message: 'Color not found', success: false };
      }

      const newOrder = await this.prisma.order.create({
        data: {
          userId: req['user'].id,
          colorId: createOrderDto.colorId,
          productId: createOrderDto.productId,
          count: createOrderDto.count,
        },
      });

      return {
        message: 'Order created successfully',
        success: true,
        order: newOrder,
      };
    } catch (error) {
      console.error('Error creating order:', error.message);
      return {
        message: 'An error occurred while creating the order',
        success: false,
      };
    }
  }

  async findAll() {
    try {
      const orders = await this.prisma.order.findMany();
      return {
        message: 'Orders retrieved successfully',
        success: true,
        orders,
      };
    } catch (error) {
      console.error('Error retrieving orders:', error.message);
      return {
        message: 'An error occurred while retrieving orders',
        success: false,
      };
    }
  }

  async findOne(id: number) {
    try {
      const order = await this.prisma.order.findUnique({ where: { id } });
      if (!order) {
        return { message: 'Order not found', success: false };
      }
      return { message: 'Order retrieved successfully', success: true, order };
    } catch (error) {
      console.error('Error retrieving order:', error.message);
      return {
        message: 'An error occurred while retrieving the order',
        success: false,
      };
    }
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    try {
      const updatedOrder = await this.prisma.order.update({
        where: { id },
        data: updateOrderDto,
      });
      return {
        message: 'Order updated successfully',
        success: true,
        order: updatedOrder,
      };
    } catch (error) {
      console.error('Error updating order:', error.message);
      return {
        message: 'An error occurred while updating the order',
        success: false,
      };
    }
  }

  async remove(id: number) {
    try {
      await this.prisma.order.delete({ where: { id } });
      return { message: 'Order removed successfully', success: true };
    } catch (error) {
      console.error('Error removing order:', error.message);
      return {
        message: 'An error occurred while removing the order',
        success: false,
      };
    }
  }
}

// orderda crudini tekshiribchiq yaxshilab birinchi createdan boshla
