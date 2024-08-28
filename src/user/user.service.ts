import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  // ฟังก์ชันเพื่อค้นหาผู้ใช้ตามอีเมล
  async findUserByEmail(email: string) {
    return this.prisma.users.findUnique({
      where: { email },
    });
  }
}
