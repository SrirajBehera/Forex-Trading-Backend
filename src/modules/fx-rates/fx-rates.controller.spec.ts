import { Test, TestingModule } from '@nestjs/testing';
import { FxRatesController } from './fx-rates.controller';
import { FxRatesService } from './fx-rates.service';
import { FxRatesDto } from './dto/fx-rate.dto';
import { FxConversionDto } from './dto/fx-conversion.dto';
import { FxRateResponse } from './dto/fx-rate-response.dto';
import { FxConversionResponse } from './dto/fx-conversion-response.dto';
import { Request } from 'express';

describe('FxRatesController', () => {
  let controller: FxRatesController;
  let service: FxRatesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FxRatesController],
      providers: [
        {
          provide: FxRatesService,
          useValue: {
            getFxRate: jest.fn(),
            convertFx: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<FxRatesController>(FxRatesController);
    service = module.get<FxRatesService>(FxRatesService);
  });

  describe('getFxRate', () => {
    it('should return a valid FxRateResponse', async () => {
      const fxRatesDto: FxRatesDto = {
        fromCurrency: 'USD',
        toCurrency: 'EUR',
      };

      const expectedResponse: FxRateResponse = {
        quoteId: 'abc123',
        expiry_at: '12:34:56',
      };

      jest.spyOn(service, 'getFxRate').mockResolvedValue(expectedResponse);

      const result = await controller.getFxRate(fxRatesDto);
      expect(result).toEqual(expectedResponse);
      expect(service.getFxRate).toHaveBeenCalledWith(fxRatesDto);
    });
  });

  describe('convertFx', () => {
    it('should return a valid FxConversionResponse', async () => {
      const fxConversionDto: FxConversionDto = {
        quoteId: 'abc123',
        fromCurrency: 'USD',
        toCurrency: 'EUR',
        amount: 100,
      };

      const expectedResponse: FxConversionResponse = {
        convertedAmount: 90.0,
        currency: 'EUR',
      };

      jest.spyOn(service, 'convertFx').mockResolvedValue(expectedResponse);

      const req = { headers: { authorization: 'Bearer token' } } as Request;
      const result = await controller.convertFx(req, fxConversionDto);
      expect(result).toEqual(expectedResponse);
      expect(service.convertFx).toHaveBeenCalledWith(req, fxConversionDto);
    });
  });
});
