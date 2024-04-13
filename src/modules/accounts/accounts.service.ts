import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../auth/user.entity';
import { TopUpAccountDto } from './dto/top-up-account.dto';
import { GetAccountBalanceResponse } from './dto/account-balance.dto';

@Injectable()
export class AccountsService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async topUpAccount(
    topUpAccountDto: TopUpAccountDto,
    email: string,
  ): Promise<UserDocument> {
    const user = await this.userModel.findOneAndUpdate(
      { email },
      {
        $inc: {
          [`balances.${topUpAccountDto.currency}`]: topUpAccountDto.amount,
        },
      },
      { new: true, upsert: true },
    );
    return user;
  }

  async getAccountBalance(email: string): Promise<GetAccountBalanceResponse> {
    const user = await this.userModel.findOne({ email });
    return { balances: user.balances };
  }

  async getCurrencyBalance(email: string, fromCurrency: string) {
    const user = await this.userModel.findOne({ email });
    const balance = user.balances.get(fromCurrency);
    return balance !== undefined ? balance : -1; // Return balance for the specified currency or -1 if not found
  }
}
