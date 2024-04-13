import { IsNotEmpty, IsString } from 'class-validator';

export class FxRatesDto {
  @IsNotEmpty()
  @IsString()
  fromCurrency: string;

  @IsNotEmpty()
  @IsString()
  toCurrency: string;
}
