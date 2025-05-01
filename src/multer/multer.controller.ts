import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Get,
  Param,
  Delete,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterService } from './multer.service';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody, ApiParam } from '@nestjs/swagger';
import { Response } from 'express';
import * as path from 'path';
import * as fs from 'fs';

@ApiTags('Multer')
@Controller('multer')
export class MulterController {
  constructor(private readonly multerService: MulterService) {}

  @Post('upload')
  @ApiOperation({ summary: 'Upload an image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file', new MulterService().getMulterConfig()))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.multerService.create(file);
  }

  @Get(':filename')
  @ApiOperation({ summary: 'Retrieve an image' })
  @ApiParam({ name: 'filename', description: 'Name of the file to retrieve' })
  async getFile(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = path.join('./uploads', filename);
    if (!fs.existsSync(filePath)) {
      return res.status(HttpStatus.NOT_FOUND).json({ message: 'File not found' });
    }
    res.sendFile(filePath, { root: '.' });
  }

  @Delete(':filename')
  @ApiOperation({ summary: 'Delete an image' })
  @ApiParam({ name: 'filename', description: 'Name of the file to delete' })
  deleteFile(@Param('filename') filename: string) {
    return this.multerService.remove(filename);
  }
}
