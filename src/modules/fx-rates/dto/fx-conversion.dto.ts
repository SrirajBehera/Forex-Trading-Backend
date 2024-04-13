import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class FxConversionDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  quoteId: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  fromCurrency: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  toCurrency: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  amount: number;
}
