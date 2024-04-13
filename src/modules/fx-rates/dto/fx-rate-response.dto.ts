import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class FxRateResponse {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  quoteId: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  expiry_at: string;
}
