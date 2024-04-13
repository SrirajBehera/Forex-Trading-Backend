import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class FxConversionResponse {
  @IsNotEmpty()
  @IsNumber()
  convertedAmount: number;

  @IsNotEmpty()
  @IsString()
  currency: string;
}
