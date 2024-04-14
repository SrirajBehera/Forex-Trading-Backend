import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../auth/user.entity';
import { TopUpAccountDto } from './dto/top-up-account.dto';
import { GetAccountBalanceResponse } from './dto/account-balance.dto';
import { CurrencyValidatorService } from '../../utils/currency-validator.service';
import { TopUpAccountResponseDto } from './dto/top-up-account-response.dto';

@Injectable()
export class AccountsService {
  /**
   * Constructor of AccountsService.
   * @param {Model<UserDocument>} userModel - The Mongoose model for User entity.
   * @param {CurrencyValidatorService} currencyValidatorService - The service for validating currencies.
   */
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private currencyValidatorService: CurrencyValidatorService,
  ) {}

  /**
   * Tops up the account balance for the specified user.
   * @param {TopUpAccountDto} topUpAccountDto - The DTO containing top-up details.
   * @param {string} email - The email address of the user.
   * @returns {Promise<TopUpAccountResponseDto>} The response containing updated account balances.
   */
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

  /**
   * Retrieves the account balance for the specified user.
   * @param {string} email - The email address of the user.
   * @returns {Promise<GetAccountBalanceResponse>} The response containing account balances.
   */
  async getAccountBalance(email: string): Promise<GetAccountBalanceResponse> {
    const user = await this.userModel.findOne({ email });
    return { balances: user.balances };
  }

  /**
   * Retrieves the balance for the specified currency belonging to the user.
   * @param {string} email - The email address of the user.
   * @param {string} fromCurrency - The currency for which the balance is requested.
   * @returns {Promise<number>} The balance for the specified currency or -1 if not found.
   */
  async getCurrencyBalance(email: string, fromCurrency: string): Promise<number> {
    const user = await this.userModel.findOne({ email });
    if (!user || !user.balances) {
      return -1; // Return -1 if the user or balances are not found
    }
    const balance = user.balances.get(fromCurrency);
    return balance !== undefined ? balance : -1; // Return balance for the specified currency or -1 if not found
  }
}
