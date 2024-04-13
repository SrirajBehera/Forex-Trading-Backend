import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccountsService } from './accounts.service';
import { TopUpAccountDto } from './dto/top-up-account.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserDocument } from '../auth/user.entity';
import { TopUpAccountResponseDto } from './dto/top-up-account-response.dto';

@ApiTags('Accounts')
@Controller('accounts')
@UseGuards(AuthGuard('jwt'))
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post('topup')
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Top up account' })
  @ApiResponse({
    status: 201,
    description: 'Account top-up successful',
    type: TopUpAccountResponseDto,
  })
  topUpAccount(
    @Body() topUpAccountDto: TopUpAccountDto,
    @Request() req: { user: UserDocument },
  ) {
    return this.accountsService.topUpAccount(topUpAccountDto, req.user.email);
  }

  @Get('balance')
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Get account balance' })
  @ApiResponse({
    status: 200,
    description: 'Returns the account balance',
    schema: {
      example: {
        balances: {
          USD: 1000,
          EUR: 500,
          GBP: 300,
        },
      },
    },
  })
  getAccountBalance(@Request() req: { user: UserDocument }) {
    return this.accountsService.getAccountBalance(req.user.email);
  }
}
