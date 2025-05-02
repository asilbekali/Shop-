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
    try {
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

      if (!bazaRegion) {
        // Instead of throwing an error, we return a message that the region is not found.
        return {
          message: `Region with id ${dto.regionId} not found. Please ensure the region is correct.`,
          regionFound: false,
        };
      }

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
          message: `One Time password sent to your email dear our new user ${newUser.firstName}`,
        };
      } else {
        throw new BadRequestException('Bad email address entered');
      }
    } catch (error) {
      console.error('Error during user registration:', error);
      throw new BadRequestException(
        `Error during user registration: ${error.message}`,
      );
    }
  }

  // ///////////////////////////////////////////////////////////////////////

  async resentOtp(email) {
    authenticator.options = { step: 1200 };
    const secret = authenticator.generateSecret();
    const otp = authenticator.generate(secret);

    console.log(otp); //-----------------------------------------

    await this.mailer.sendEmail(email, 'Your otp', otp);

    this.otpStore.set(email, {
      otp,
      expiresAt: Date.now() + 1200000,
    });

    return {message: "Otp send to your email"}
  }

  async verify(email: string, otpBody: string) {
    try {
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

        return { message: `your accaunt ${updatedUser.status}` };
      } else {
        throw new BadRequestException('OTP is invalid or expired');
      }
    } catch (error) {
      console.error('Error in OTP verification:', error);
      throw new BadRequestException('Error in OTP verification');
    }
  }

  // ///////////////////////////////////////////////////////////////////////

  async getAccessToken(bazaUser: any) {
    try {
      const token = this.jwt.sign(
        {
          id: bazaUser.id,
          lastName: bazaUser.lastName,
          firstName: bazaUser.firstName,
          role: bazaUser.role,
          email: bazaUser.email,
          status: bazaUser.status,
          password: bazaUser.password,
        },
        { expiresIn: '1h' },
      );

      return token;
    } catch (error) {
      console.error('Error in getting access token:', error);
      throw new BadRequestException('Error in generating access token');
    }
  }

  // ///////////////////////////////////////////////////////////////////////

  async generateRefreshToken(bazaUser: any) {
    try {
      const token = this.jwt.sign(
        {
          id: bazaUser.id,
          lastName: bazaUser.lastName,
          firstName: bazaUser.firstName,
          role: bazaUser.role,
          email: bazaUser.email,
          status: bazaUser.status,
          password: bazaUser.password,
        },
        { expiresIn: '7d' },
      );

      return token;
    } catch (error) {
      console.error('Error in generating refresh token:', error);
      throw new BadRequestException('Error in generating refresh token');
    }
  }

  // ///////////////////////////////////////////////////////////////////////

  async login(email: string, password: string) {
    try {
      const bazaUser = await this.findUser(email);

      if (!bazaUser) {
        throw new BadRequestException('User not found');
      }

      const status = bazaUser.status;

      if (status == userStatus['offline']) {
        throw new BadRequestException('First you must verify your account!');
      }

      const match = await bcrypt.compareSync(password, bazaUser.password);

      if (!match) {
        throw new BadRequestException('Wrong password');
      }

      const accessToken = await this.getAccessToken(bazaUser);
      const refreshToken = await this.generateRefreshToken(bazaUser);
      return { AccessToken: accessToken, RefreshToken: refreshToken };
    } catch (error) {
      console.error('Error in user login:', error);
      throw new BadRequestException('Error in user login');
    }
  }

  async meUser(user: any) {
    return user;
  }

  // ///////////////////////////////////////////////////////////////////////

  async registerAdmin(dto: CreateUserDto) {
    try {
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

      if (!bazaRegion) {
        // Region ID topilmasa, loglash va to'liq xatolik yuborish
        console.log(`Region with id ${dto.regionId} not found`);
        throw new BadRequestException(`Region id ${dto.regionId} not found`);
      }

      if (typeof dto.email == 'string' && dto.email.endsWith('@gmail.com')) {
        const newUser = await this.prisma.user.create({
          data: {
            firstName: dto.firstName,
            lastName: dto.lastName,
            role: RoleUser['admin'],
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
          message: `One Time password sent to your email dear our new user ${newUser.firstName}`,
        };
      } else {
        throw new BadRequestException('Bad email address entered');
      }
    } catch (error) {
      console.error('Error in admin registration:', error);
      throw new BadRequestException(
        `Error in admin registration: ${error.message}`,
      );
    }
  }

  // ///////////////////////////////////////////////////////////////////////

  async addAdmin(userId: number, req: any) {
    try {
      if (req.role == Role.ADMIN) {
        const bazaUser = await this.prisma.user.findFirst({
          where: { id: userId },
        });

        if (!bazaUser) {
          throw new BadRequestException('User not found');
        } else {
          return await this.prisma.user.update({
            where: { id: userId },
            data: { role: Role.ADMIN },
          });
        }
      }
    } catch (error) {
      console.error('Error in adding admin:', error);
      throw new BadRequestException('Error in add admin');
    }
  }

  async getAllUser() {
    return await this.prisma.user.findMany();
  }

  ///////////////////////////////////////////////////////////////////////

  async refreshToken(refresh: string) {
    try {
      const bazaUser = this.jwt.verify(refresh['refreshToken']);
      return { accessToken: await this.getAccessToken(bazaUser) };
    } catch (error) {
      console.error('Error in generating refresh token:', error);
      throw new BadRequestException('Error in generating refresh token');
    }
  }

  ///////////////////////////////////////////////////////////////////////

  async getUsersByRegion(regionId: number) {
    try {
      const users = await this.prisma.user.findMany({
        where: { regionId },
      });

      if (!users.length) {
        throw new NotFoundException('No users found for this region');
      }

      return users;
    } catch (error) {
      console.error('Error in fetching users by region:', error);
      throw new NotFoundException('Error in fetching users by region');
    }
  }
}
