import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { MailModule } from 'src/mail/mail.module';
import * as redisStore from 'cache-manager-ioredis';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    PrismaModule,
    MailModule,
    JwtModule.register({
      secret: 'shop',
      signOptions: { expiresIn: '1h' },
      global: true,
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 60 * 1000,
      store: redisStore,
      host: '127.17.0.2',
      port: 6379,
    }),
  ],

  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
