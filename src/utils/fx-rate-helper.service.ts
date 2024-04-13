import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class FxRateHelper {
  async fetchAndStoreFxRates(
    fromCurrency: string,
    toCurrency: string,
  ): Promise<number> {
    const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
    const url = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${fromCurrency}&to_currency=${toCurrency}&apikey=${apiKey}`;

    const apiResponse = await axios.get(url);

    const exchangeRate =
      apiResponse.data['Realtime Currency Exchange Rate']['5. Exchange Rate'];

    return exchangeRate;
  }
}
