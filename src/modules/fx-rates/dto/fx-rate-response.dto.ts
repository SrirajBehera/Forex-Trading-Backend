import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class FxRateResponse {
  @IsNotEmpty()
  @IsString()
  quoteId: string;

  @IsNotEmpty()
  @IsString()
  expiry_at: string;
}
