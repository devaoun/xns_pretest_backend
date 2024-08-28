import { IsInt, IsString, MinLength, MaxLength } from 'class-validator';

export class AddQuoteDto {
    @IsInt()
    userId: number;

    @IsString()
    @MinLength(2)
    @MaxLength(60)
    title: string;
}

