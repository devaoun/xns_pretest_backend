import { Test, TestingModule } from '@nestjs/testing';
import { QuoteService } from './quote.service';
import { PrismaService } from '../prisma.service';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

describe('QuoteService', () => {
  let service: QuoteService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuoteService,
        {
          provide: PrismaService,
          useValue: {
            users: {
              findUnique: jest.fn(),
            },
            quotes: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
            },
            votes: {
              findFirst: jest.fn(),
              create: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<QuoteService>(QuoteService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
