import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request as ExpressRequest } from 'express';


@UseGuards(AuthGuard)
@ApiTags('Message')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('message')
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
    private readonly prisma: PrismaService,
  ) {}

  @ApiOperation({ summary: 'Create a new message' })
  @ApiResponse({ status: 201, description: 'Message created successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  @ApiBody({ type: CreateMessageDto })
  @Post()
  create(
    @Body() createMessageDto: CreateMessageDto,
    @Request() req: ExpressRequest,
  ) {
    return this.messageService.create(createMessageDto, req);
  }

  @ApiOperation({ summary: 'Retrieve all messages' })
  @ApiResponse({
    status: 200,
    description: 'List of messages retrieved successfully.',
  })
  @ApiResponse({ status: 403, description: 'Unauthorized request.' })
  @Get()
  findAll(@Request() req: ExpressRequest) {
    return this.messageService.findAll(req);
  }

  @ApiOperation({ summary: 'Retrieve a message by ID' })
  @ApiResponse({ status: 200, description: 'Message retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Message not found.' })
  @ApiParam({
    name: 'id',
    description: 'ID of the message to retrieve',
    required: true,
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.messageService.findOne(+id);
  }

  @ApiOperation({ summary: 'Update a message' })
  @ApiResponse({ status: 200, description: 'Message updated successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  @ApiParam({
    name: 'id',
    description: 'ID of the message to update',
    required: true,
  })
  @ApiBody({ type: UpdateMessageDto })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMessageDto: UpdateMessageDto) {
    return this.messageService.update(+id, updateMessageDto);
  }

  @ApiOperation({ summary: 'Delete a message' })
  @ApiResponse({ status: 200, description: 'Message deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Message not found.' })
  @ApiParam({
    name: 'id',
    description: 'ID of the message to delete',
    required: true,
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messageService.remove(+id);
  }
}
