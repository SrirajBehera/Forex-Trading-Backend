import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../auth/user.entity';
import { TopUpAccountDto } from './dto/top-up-account.dto';
import { GetAccountBalanceResponse } from './dto/account-balance.dto';
import { CurrencyValidatorService } from 'src/utils/currency-validator.service';
import { TopUpAccountResponseDto } from './dto/top-up-account-response.dto';

@Injectable()
export class AccountsService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private currencyValidatorService: CurrencyValidatorService,
  ) {}

  async topUpAccount(
    topUpAccountDto: TopUpAccountDto,
    email: string,
  ): Promise<TopUpAccountResponseDto> {
    this.currencyValidatorService.validateCurrencies(topUpAccountDto.currency);

    const user = await this.userModel.findOneAndUpdate(
      { email },
      {
        $inc: {
          [`balances.${topUpAccountDto.currency}`]: topUpAccountDto.amount,
        },
      },
      { new: true, upsert: true },
    );
    return {
      email: email,
      balances: user.balances,
    };
  }

  async getAccountBalance(email: string): Promise<GetAccountBalanceResponse> {
    const user = await this.userModel.findOne({ email });
    return { balances: user.balances };
  }

  async getCurrencyBalance(email: string, fromCurrency: string): Promise<number> {
    const user = await this.userModel.findOne({ email });
    const balance = user.balances.get(fromCurrency);
    return balance !== undefined ? balance : -1; // Return balance for the specified currency or -1 if not found
  }
}
