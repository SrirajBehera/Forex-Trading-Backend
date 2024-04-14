import { BadRequestException, Injectable } from '@nestjs/common';
import { validCurrencies } from '../constants/validCurrencies';

@Injectable()
export class CurrencyValidatorService {
  /**
   * Validates currencies.
   * @param {string} fromCurrency - The source currency.
   * @param {string} toCurrency - The target currency.
   */
  validateCurrencies(fromCurrency?: string, toCurrency?: string): void {
    if (fromCurrency && toCurrency) {
      this.validateTwoCurrencies(fromCurrency, toCurrency);
    } else if (fromCurrency) {
      this.validateOneCurrency(fromCurrency);
    } else {
      throw new BadRequestException('Currency code(s) are required');
    }
  }

  /**
   * Validates two currencies.
   * @param {string} fromCurrency - The source currency.
   * @param {string} toCurrency - The target currency.
   */
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

  /**
   * Validates a single currency.
   * @param {string} currency - The currency code.
   */
  private validateOneCurrency(currency: string): void {
    const currencyValid = validCurrencies.some(
      (item) => item.code === currency,
    );

    if (!currencyValid) {
      throw new BadRequestException('Invalid currency code');
    }
  }
}
