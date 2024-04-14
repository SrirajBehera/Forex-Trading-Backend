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
  /**
   * Constructor of AccountsController.
   * @param {AccountsService} accountsService - The service for managing user accounts.
   */
  constructor(private readonly accountsService: AccountsService) {}

  /**
   * Tops up the account balance.
   * @param {TopUpAccountDto} topUpAccountDto - The DTO containing top-up details.
   * @param {UserDocument} req.user - The authenticated user.
   * @returns {Promise<TopUpAccountResponseDto>} The response containing updated account balances.
   */
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
  ): Promise<TopUpAccountResponseDto> {
    return this.accountsService.topUpAccount(topUpAccountDto, req.user.email);
  }

  /**
   * Retrieves the account balance.
   * @param {UserDocument} req.user - The authenticated user.
   * @returns {Promise<any>} The response containing the account balances.
   */
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
  getAccountBalance(@Request() req: { user: UserDocument }): Promise<any> {
    return this.accountsService.getAccountBalance(req.user.email);
  }
}
