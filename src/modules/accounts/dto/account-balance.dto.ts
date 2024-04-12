// import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class GetAccountBalanceResponse {
  //   @ApiProperty()
  @IsNotEmpty()
  balances: Map<string, number>;
}
