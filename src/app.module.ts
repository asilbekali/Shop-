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
import { LikeModule } from './like/like.module';
import { OrderModule } from './order/order.module';
import { CommentModule } from './comment/comment.module';
import { MessageModule } from './message/message.module';

@Module({
  imports: [PrismaModule, UserModule, MulterModule, RegionModule,  CategoryModule, ColorModule, ProductModule, LikeModule, OrderModule, CommentModule, MessageModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
