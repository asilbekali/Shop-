import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class MulterService {
  private readonly uploadPath = './uploads';

  getMulterConfig() {
    return {
      storage: diskStorage({
        destination: this.uploadPath,
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const fileExtension = extname(file.originalname);
          const fileName = `${file.originalname.split('.')[0]}-${uniqueSuffix}${fileExtension}`;
          callback(null, fileName);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          return callback(new Error('Only image files are allowed!'), false);
        }
        callback(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    };
  }

  create(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    const imagePath = `${this.uploadPath}/${file.filename}`;
    return { message: 'File uploaded successfully', path: imagePath };
  }

  findOne(filename: string) {
    const filePath = path.join(this.uploadPath, filename);
    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('File not found');
    }
    return { message: 'File found', path: filePath };
  }

  remove(filename: string) {
    const filePath = path.join(this.uploadPath, filename);
    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('File not found');
    }
    fs.unlinkSync(filePath);
    return { message: 'File deleted successfully' };
  }
}
