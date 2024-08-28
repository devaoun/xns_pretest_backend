import { Controller, Post, Get, Body, Patch, Param, UseGuards, Req, Query } from '@nestjs/common';
import { QuoteService } from './quote.service';
import { AddQuoteDto } from './dto/add-quote.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('quotes')
export class QuoteController {
  constructor(private quoteService: QuoteService) { }

  @Get()
  async getAllQuotes() {
    return this.quoteService.getAllQuotes();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async addQuote(@Body() input: AddQuoteDto) {
    const { userId, title } = input;
    return this.quoteService.createQuote(+userId, title);
  }

  @Patch(':id/vote')
  @UseGuards(JwtAuthGuard)
  async voteQuote(@Param('id') id: string, @Req() req) {
    const userId = req.user.userId;
    return this.quoteService.voteQuote(+id, userId);
  }

  @Get('my-vote')
  @UseGuards(JwtAuthGuard)
  async getMyVoteQuote(@Req() req) {
    const userId = req.user.userId;
    return this.quoteService.getMyVoteQuote(userId);
  }

  @Get('search')
  async getQuoteBySearch(@Query('term') searchTerm: string) {
    return this.quoteService.getQuoteBySearch(searchTerm);
  }
}
