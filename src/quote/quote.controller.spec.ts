import { Test, TestingModule } from '@nestjs/testing';
import { QuoteController } from './quote.controller';
import { QuoteService } from './quote.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AddQuoteDto } from './dto/add-quote.dto';

describe('QuoteController', () => {
  let controller: QuoteController;
  let service: QuoteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuoteController],
      providers: [
        {
          provide: QuoteService,
          useValue: {
            getAllQuotes: jest.fn(),
            createQuote: jest.fn(),
            voteQuote: jest.fn(),
            getMyVoteQuote: jest.fn(),
            getQuoteBySearch: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<QuoteController>(QuoteController);
    service = module.get<QuoteService>(QuoteService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
