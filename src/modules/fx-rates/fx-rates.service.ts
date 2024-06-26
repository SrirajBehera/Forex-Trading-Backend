import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  Req,
} from '@nestjs/common';
import { FxConversionDto } from './dto/fx-conversion.dto';
import { FxConversionResponse } from './dto/fx-conversion-response.dto';
import { FxRateResponse } from './dto/fx-rate-response.dto';
import { FxRateHelper } from '../../utils/fx-rate-helper.service';
import { FxRatesDto } from './dto/fx-rate.dto';
import { v4 as uuidv4 } from 'uuid';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { AccountsService } from '../accounts/accounts.service';
import { AuthService } from '../auth/auth.service';
import { Request } from 'express';
import { CurrencyValidatorService } from '../../utils/currency-validator.service';

interface FXRateInterface {
  quoteId: string;
  expiry_at: Date;
  from: string;
  to: string;
  rate: number;
}

@Injectable()
export class FxRatesService {
  /**
   * Constructor of FxRatesService.
   * @param {Cache} cacheManager - The cache manager.
   * @param {FxRateHelper} fxRateHelper - The helper service for fetching FX rates.
   * @param {AccountsService} accountsService - The service for managing user accounts.
   * @param {AuthService} authService - The authentication service.
   * @param {CurrencyValidatorService} currencyValidatorService - The service for validating currencies.
   */
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private fxRateHelper: FxRateHelper,
    private accountsService: AccountsService,
    private authService: AuthService,
    private currencyValidatorService: CurrencyValidatorService,
  ) {}

  /**
   * Retrieves FX rates.
   * @param {FxRatesDto} FxRatesDto - The DTO containing FX rate details.
   * @returns {Promise<FxRateResponse>} The response containing quoteId and expiry time against associated currency-pair exchange rate.
   */
  async getFxRate(FxRatesDto: FxRatesDto): Promise<FxRateResponse> {
    const fromCurrency = FxRatesDto.fromCurrency;
    const toCurrency = FxRatesDto.toCurrency;

    this.currencyValidatorService.validateCurrencies(fromCurrency, toCurrency);

    const cacheKey = `${fromCurrency}-${toCurrency}`;
    const cachedRateData =
      await this.cacheManager.get<FXRateInterface>(cacheKey);

    if (cachedRateData && cachedRateData.expiry_at > new Date()) {
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

  /**
   * Fetches and stores FX rates.
   * @param {FxRatesDto} FxRatesDto - The DTO containing FX rate details.
   * @returns {Promise<FXRateInterface>} The FX rate data.
   */
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

  /**
   * Retrieves FX rate by quoteId.
   * @param {string} quoteId - The quoteId.
   * @param {string} cacheKey - The cache key.
   * @returns {Promise<FXRateInterface | null>} The FX rate data if found, otherwise null.
   */
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

  /**
   * Converts FX.
   * @param {Request} req - The HTTP request object.
   * @param {FxConversionDto} FxConversionDto - The DTO containing FX conversion details.
   * @returns {Promise<FxConversionResponse>} The response containing converted amount.
   */
  async convertFx(
    @Req() req: Request,
    FxConversionDto: FxConversionDto,
  ): Promise<FxConversionResponse> {
    const quoteId = FxConversionDto.quoteId;
    const fromCurrency = FxConversionDto.fromCurrency;
    const toCurrency = FxConversionDto.toCurrency;

    this.currencyValidatorService.validateCurrencies(fromCurrency, toCurrency);

    const cacheKey = `${fromCurrency}-${toCurrency}`;

    const fxRate = await this.getFxRateByQuoteId(quoteId, cacheKey);

    const convertedAmount = FxConversionDto.amount * fxRate.rate;

    const userEmail = await this.authService.getUserEmailFromToken(
      req.headers.authorization,
    );

    // Retrieve user's balance for the fromCurrency
    const userBalance = await this.accountsService.getCurrencyBalance(
      userEmail,
      fromCurrency,
    );

    // Check if the user's balance is sufficient for the conversion
    if (userBalance < FxConversionDto.amount) {
      throw new BadRequestException('Insufficient balance');
    }

    // Update the user's account balance
    await this.accountsService.topUpAccount(
      {
        currency: FxConversionDto.fromCurrency,
        amount: -FxConversionDto.amount, // Subtract the amount from the user's balance
      },
      userEmail,
    );

    await this.accountsService.topUpAccount(
      {
        currency: FxConversionDto.toCurrency,
        amount: convertedAmount, // Add the converted amount to the user's balance
      },
      userEmail,
    );

    return { convertedAmount, currency: FxConversionDto.toCurrency };
  }
}
