import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FxConversionDto } from './dto/fx-conversion.dto';
import { FxConversionResponse } from './dto/fx-conversion-response.dto';
import { FxRateResponse } from './dto/fx-rate-response.dto';
import { FxRateHelper } from 'src/utils/fx-rate-helper.service';
import { FxRatesDto } from './dto/fx-rate.dto';
import { v4 as uuidv4 } from 'uuid';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

interface FXRateInterface {
  quoteId: string;
  expiry_at: Date;
  from: string;
  to: string;
  rate: number;
}

@Injectable()
export class FxRatesService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private fxRateHelper: FxRateHelper,
  ) {}

  async getFxRate(FxRatesDto: FxRatesDto): Promise<FxRateResponse> {
    const fromCurrency = FxRatesDto.fromCurrency;
    const toCurrency = FxRatesDto.toCurrency;
    const cacheKey = `${fromCurrency}-${toCurrency}`;
    const cachedRateData =
      await this.cacheManager.get<FXRateInterface>(cacheKey);

    if (cachedRateData && cachedRateData.expiry_at > new Date()) {
      console.log('Cached rate data');
      return {
        quoteId: cachedRateData.quoteId,
        expiry_at: cachedRateData.expiry_at.toLocaleTimeString(),
      };
    }

    const freshRate = await this.fetchAndStoreFxRates(FxRatesDto);
    const quoteId = freshRate.quoteId;
    const expiry_at = freshRate.expiry_at.toLocaleTimeString();

    return { quoteId, expiry_at };
  }

  async fetchAndStoreFxRates(FxRatesDto: FxRatesDto): Promise<FXRateInterface> {
    const fromCurrency = FxRatesDto.fromCurrency;
    const toCurrency = FxRatesDto.toCurrency;

    const freshRate = await this.fxRateHelper.fetchAndStoreFxRates(
      fromCurrency,
      toCurrency,
    );
    const quoteId = uuidv4();
    const expiry_at = new Date(Date.now() + 30 * 1000);

    const fxRate: FXRateInterface = {
      quoteId,
      expiry_at: expiry_at,
      from: fromCurrency,
      to: toCurrency,
      rate: freshRate,
    };

    const cacheKey = `${fromCurrency}-${toCurrency}`;
    await this.cacheManager.set(cacheKey, fxRate, 30000);

    return fxRate;
  }

  async getFxRateByQuoteId(
    quoteId: string,
    cacheKey: string,
  ): Promise<FXRateInterface | null> {
    const cacheRate = await this.cacheManager.get<FXRateInterface>(cacheKey);
    if (!cacheRate) {
      throw new NotFoundException(
        `Either quoteId expired or No FX rate data found for cache key: ${cacheKey}`,
      );
    }

    if (cacheRate.quoteId !== quoteId) {
      throw new BadRequestException('Invalid quoteId');
    }

    return cacheRate;
  }

  async convertFx(
    FxConversionDto: FxConversionDto,
  ): Promise<FxConversionResponse> {
    const quoteId = FxConversionDto.quoteId;
    const fromCurrency = FxConversionDto.fromCurrency;
    const toCurrency = FxConversionDto.toCurrency;

    const cacheKey = `${fromCurrency}-${toCurrency}`;

    const fxRate = await this.getFxRateByQuoteId(quoteId, cacheKey);

    const convertedAmount = FxConversionDto.amount * fxRate.rate;

    return { convertedAmount, currency: FxConversionDto.toCurrency };
  }
}
