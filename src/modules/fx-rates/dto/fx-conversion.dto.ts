import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class FxConversionDto {
  @IsNotEmpty()
  @IsString()
  quoteId: string;

  @IsNotEmpty()
  @IsString()
  fromCurrency: string;

  @IsNotEmpty()
  @IsString()
  toCurrency: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;
}
