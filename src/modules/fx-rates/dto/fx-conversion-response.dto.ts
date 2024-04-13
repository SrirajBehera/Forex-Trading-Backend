import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class FxConversionResponse {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  convertedAmount: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  currency: string;
}
