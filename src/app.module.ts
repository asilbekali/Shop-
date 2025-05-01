import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { MulterModule } from './multer/multer.module';
import { RegionModule } from './region/region.module';
import { CategoryModule } from './category/category.module';
import { ColorModule } from './color/color.module';
import { ProductModule } from './product/product.module';

@Module({
  imports: [PrismaModule, UserModule, MulterModule, RegionModule,  CategoryModule, ColorModule, ProductModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
