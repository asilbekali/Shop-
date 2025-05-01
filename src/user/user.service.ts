import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { RoleUser, userStatus } from '@prisma/client';
import { localsName } from 'ejs';
import { Role } from './enum/roles.enum';
import { MailService } from 'src/mail/mail.service';
import { authenticator } from 'otplib';

@Injectable()
export class UserService {
  private otpStore = new Map<string, { otp: string; expiresAt: number }>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly mailer: MailService,
  ) {}

  async findUser(email: string) {
    try {
      const user = await this.prisma.user.findFirst({
        where: { email: email },
      });

      if (user) {
        return user;
      } else {
        return false;
      }
    } catch (error) {
      console.log(error);
      throw new NotFoundException(
        `Error occurred while finding user: ${error.message}`,
      );
    }
  }

  async register(dto: CreateUserDto) {
    const bazaUser = await this.findUser(dto.email);
    if (bazaUser) {
      throw new ConflictException('User already exists');
    }

    if (!Object.values(Role).includes(dto.role)) {
      throw new ConflictException('Invalid role');
    }

    const hash = bcrypt.hashSync(dto.password, 10);

    const bazaRegion = await this.prisma.region.findFirst({
      where: { id: dto.regionId },
    });

    if (bazaRegion) {
      if (typeof dto.email == 'string' && dto.email.endsWith('@gmail.com')) {
        const newUser = await this.prisma.user.create({
          data: {
            firstName: dto.firstName,
            lastName: dto.lastName,
            role: dto.role as RoleUser,
            email: dto.email,
            password: hash,
            picture: dto.picture,
            regionId: dto.regionId,
            year: dto.year,
            status: userStatus.offline,
          },
        });

        authenticator.options = { step: 1200 };
        const secret = authenticator.generateSecret();
        const otp = authenticator.generate(secret);

        console.log(otp); //-----------------------------------------

        await this.mailer.sendEmail(newUser.email, 'Your otp', otp);

        this.otpStore.set(newUser.email, {
          otp,
          expiresAt: Date.now() + 1200000,
        });

        return {
          message: `One Time password send to your email dear our new user ${newUser.firstName}`,
        };
      } else {
        throw new BadRequestException('Bad email adress entred');
      }
    } else {
      throw new BadRequestException('Region id not found');
    }
  }

  // ////////////////////////////////////////////////////////////////////////////////////////////

  async verify(email: string, otpBody: string) {
    const bazaUser = await this.findUser(email);

    if (!bazaUser) {
      throw new BadRequestException('User not found');
    }

    const otpBaza = this.otpStore.get(email);

    if (otpBaza?.otp === otpBody && otpBaza.expiresAt > Date.now()) {
      const updatedUser = await this.prisma.user.update({
        where: { email: email },
        data: { status: 'active' },
      });

      return updatedUser.status;
    } else {
      throw new BadRequestException('OTP is invalid or expired');
    }
  }

  // ////////////////////////////////////////////////////////////////////////////////////////////

  async login(email: string, password: string) {
    const bazaUser = await this.findUser(email);

    if (!bazaUser) {
      throw new BadRequestException('User not found');
    }

    const status = bazaUser.status;

    if (status == userStatus['offline']) {
      throw new BadRequestException(
        'First you must be verifired your account !',
      );
    }

    const match = await bcrypt.compareSync(password, bazaUser.password);

    if (!match) {
      throw new BadRequestException('Wrong password');
    }

    const token = this.jwt.sign({
      id: bazaUser.id,
      lastName: bazaUser.lastName,
      firstName: bazaUser.firstName,
      role: bazaUser.role,
      email: bazaUser.email,
      status: bazaUser.status,
      password: bazaUser.password,
    });

    return { token };
  }

  async meUser() {
    return 'aef';
  }
}
