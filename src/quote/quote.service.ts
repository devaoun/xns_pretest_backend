import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class QuoteService {
  constructor(private prisma: PrismaService) { }

  async createQuote(userId: number, title: string) {
    const userExists = await this.prisma.users.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return this.prisma.quotes.create({
      data: {
        title,
        user: {
          connect: { id: userId },
        },
        votes: 0,
      },
    });
  }

  async getAllQuotes() {
    return this.prisma.quotes.findMany({
      include: {
        user: true,
        voters: true,
      },
      orderBy: {
        voters: {
          _count: 'desc',
        },
      },
    });
  }

  async voteQuote(quoteId: number, userId: number) {
    // ตรวจสอบว่าผู้ใช้เคยโหวตให้กับ quote ใดก่อนหน้านี้หรือไม่
    const existingVote = await this.prisma.votes.findFirst({
      where: {
        userId: userId,
      },
    });

    if (existingVote) {
      // ยกเลิกโหวตจาก quote เก่า
      await this.prisma.votes.delete({
        where: {
          id: existingVote.id,
        },
      });

      // ลดจำนวนโหวตจาก quote เก่า
      await this.prisma.quotes.update({
        where: { id: existingVote.quoteId },
        data: {
          votes: {
            decrement: 1,
          },
        },
      });
    }

    // ตรวจสอบว่า quote ใหม่มีอยู่หรือไม่
    const quote = await this.prisma.quotes.findUnique({
      where: { id: quoteId },
    });

    if (!quote) {
      throw new NotFoundException(`Quote with ID ${quoteId} not found`);
    }

    // เพิ่มโหวตให้กับ quote ใหม่
    await this.prisma.votes.create({
      data: {
        userId,
        quoteId,
      },
    });

    return this.prisma.quotes.update({
      where: { id: quoteId },
      data: {
        votes: {
          increment: 1,
        },
      },
    });
  }

  async getMyVoteQuote(userId: number) {
    return this.prisma.quotes.findMany({
      where: {
        voters: {
          some: {
            userId: userId,
          },
        },
      },
      include: {
        user: true,
        voters: true
      },
    });
  }

  async getQuoteBySearch(searchTerm: string) {
    return this.prisma.quotes.findMany({
      where: {
        title: {
          contains: searchTerm.toLowerCase(), // แปลง searchTerm เป็นตัวพิมพ์เล็ก
        },
      },
      include: {
        user: true, // รวมข้อมูลของ user
        voters: true, // รวมข้อมูลของ voters
      },
      orderBy: {
        voters: {
          _count: 'desc', // เรียงลำดับจากจำนวนโหวตมากไปน้อย
        },
      },
    });
  }
}

