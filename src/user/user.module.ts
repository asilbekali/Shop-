import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [
    PrismaModule,
    MailModule,
    JwtModule.register({
      secret: 'shop',
      signOptions: { expiresIn: '1h' },
      global: true
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
