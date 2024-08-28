import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtPayload } from './jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) { }

  // ฟังก์ชันสำหรับสร้าง JWT token
  public generateToken(userId: number, username: string) {
    const payload: JwtPayload = { sub: userId, username };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }


  // ฟังก์ชันสำหรับ signup
  async signup(createUserDto: CreateUserDto) {
    const { username, email, password } = createUserDto;

    // เข้ารหัสรหัสผ่าน
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      // สร้างผู้ใช้ใหม่ในฐานข้อมูล
      await this.prisma.users.create({
        data: {
          username,
          email,
          hashedPassword,
        },
      });

      // ส่งข้อความยืนยันการสมัครสำเร็จ
      return { message: 'Signup successfully' };
    } catch (error) {
      // ตรวจสอบว่ามีการสร้างผู้ใช้ซ้ำกันหรือไม่
      if (error.code === 'P2002') { // Prisma error code for unique constraint violation
        throw new ConflictException('Email or username already exists');
      } else {
        throw new InternalServerErrorException('Something went wrong');
      }
    }
  }
}
