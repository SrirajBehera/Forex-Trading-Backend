import { ApiProperty } from '@nestjs/swagger';

export class GetAccountBalanceResponse {
  @ApiProperty()
  balances: Map<string, number>;
}
