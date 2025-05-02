import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Request } from 'express';

@Injectable()
export class MessageService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createMessageDto: CreateMessageDto, req: Request) {
    try {
      let chat = await this.prisma.chat.findFirst({
        where: {
          OR: [
            { toId: req['user'].id, fromId: createMessageDto.toId },
            { fromId: req['user'].id, toId: createMessageDto.toId },
          ],
        },
      });

      const message = await this.prisma.message.create({
        data: {
          text: createMessageDto.text,
          fromId: req['user'].id,
          toId: createMessageDto.toId,
        },
      });

      if (!chat) {
        chat = await this.prisma.chat.create({
          data: {
            fromId: req['user'].id,
            toId: createMessageDto.toId,
            chatemessage: createMessageDto.text, 
          },
        });

        await this.prisma.chat.update({
          where: { id: chat.id },
          data: { chatemessage: createMessageDto.text }
        });
      }

      else {
        await this.prisma.chat.update({
          where: { id: chat.id },
          data: {
            chatemessage: createMessageDto.text, 
          },
        });
      }

      return {
        message: 'Message successfully sent!',
        chatId: chat.id,
        messageId: message.id,
      };
    } catch (error) {
      console.error('Error creating message:', error);
      return { message: 'An error occurred while sending the message.' };
    }
  }

  async findAll(req: Request) {
    try {
      const messages = await this.prisma.message.findMany({
        where: {
          OR: [{ fromId: req['user'].id }, { toId: req['user'].id }],
        },
        include: {
          from: true, 
          to: true, 
        },
      });

      return messages;
    } catch (error) {
      console.error('Error retrieving messages:', error);
      return { message: 'An error occurred while fetching messages.' };
    }
  }

  async findOne(id: number) {
    try {
      const message = await this.prisma.message.findUnique({
        where: { id },
        include: {
          from: true,
          to: true,
        },
      });

      if (!message) {
        return { message: 'Message not found.' };
      }

      return message;
    } catch (error) {
      console.error('Error retrieving message:', error);
      return { message: 'An error occurred while fetching the message.' };
    }
  }

  async update(id: number, updateMessageDto: UpdateMessageDto) {
    try {
      const message = await this.prisma.message.update({
        where: { id },
        data: {
          text: updateMessageDto.text, 
        },
      });

      return {
        message: 'Message successfully updated!',
        updatedMessage: message,
      };
    } catch (error) {
      console.error('Error updating message:', error);
      return { message: 'An error occurred while updating the message.' };
    }
  }

  async remove(id: number) {
    try {
      const message = await this.prisma.message.delete({
        where: { id },
      });

      return {
        message: 'Message successfully deleted!',
        deletedMessage: message,
      };
    } catch (error) {
      console.error('Error deleting message:', error);
      return { message: 'An error occurred while deleting the message.' };
    }
  }
}
