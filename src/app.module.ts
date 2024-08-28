import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma.service';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';
import { QuoteService } from './quote/quote.service';
import { QuoteController } from './quote/quote.controller';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
  ],
  providers: [PrismaService, UserService, QuoteService],
  controllers: [UserController, QuoteController],
})
export class AppModule {}
