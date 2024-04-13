import { BadRequestException, Injectable } from '@nestjs/common';
import { validCurrencies } from '../constants/validCurrencies';

@Injectable()
export class CurrencyValidatorService {
  validateCurrencies(fromCurrency?: string, toCurrency?: string): void {
    if (fromCurrency && toCurrency) {
      this.validateTwoCurrencies(fromCurrency, toCurrency);
    } else if (fromCurrency) {
      this.validateOneCurrency(fromCurrency);
    } else {
      throw new BadRequestException('Currency code(s) are required');
    }
  }

  private validateTwoCurrencies(
    fromCurrency: string,
    toCurrency: string,
  ): void {
    const fromCurrencyValid = validCurrencies.some(
      (currency) => currency.code === fromCurrency,
    );
    const toCurrencyValid = validCurrencies.some(
      (currency) => currency.code === toCurrency,
    );

    if (!fromCurrencyValid || !toCurrencyValid) {
      throw new BadRequestException('Invalid currency code(s)');
    }
  }

  private validateOneCurrency(currency: string): void {
    const currencyValid = validCurrencies.some(
      (item) => item.code === currency,
    );

    if (!currencyValid) {
      throw new BadRequestException('Invalid currency code');
    }
  }
}
