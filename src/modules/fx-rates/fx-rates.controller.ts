import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FxRatesService } from './fx-rates.service';
import { FxConversionDto } from './dto/fx-conversion.dto';
import { AuthGuard } from '@nestjs/passport';
import { FxRatesDto } from './dto/fx-rate.dto';
import { Request } from 'express';
import { FxRateResponse } from './dto/fx-rate-response.dto';
import { FxConversionResponse } from './dto/fx-conversion-response.dto';

@ApiTags('FX Rates')
@Controller()
@UseGuards(AuthGuard('jwt'))
export class FxRatesController {
  /**
   * Initializes the FxRatesController with the FxRatesService.
   * @param {FxRatesService} fxRatesService - The FxRatesService instance.
   */
  constructor(private readonly fxRatesService: FxRatesService) {}

  /**
   * Retrieves FX rates.
   * @param {FxRatesDto} FxRatesDto - The DTO containing FX rate details.
   * @returns {Promise<FxRateResponse>} The response containing quoteId and expiry time against associated currency-pair exchange rate.
   */
  @Get('fx-rates')
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Get FX rates' })
  @ApiResponse({
    status: 200,
    type: FxRateResponse,
    description:
      'Successful generation of quoteId and expiry time against associated currency-pair exchange rate',
  })
  async getFxRate(@Body() FxRatesDto: FxRatesDto): Promise<FxRateResponse> {
    return this.fxRatesService.getFxRate(FxRatesDto);
  }

  /**
   * Performs FX conversion.
   * @param {Request} req - The HTTP request object.
   * @param {FxConversionDto} fxConversionDto - The DTO containing FX conversion details.
   * @returns {Promise<FxConversionResponse>} The response containing converted amount.
   */
  @Post('fx-conversion')
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Perform FX conversion' })
  @ApiResponse({
    status: 200,
    type: FxConversionResponse,
    description: 'Converts amount to specified currency',
  })
  convertFx(
    @Req() req: Request,
    @Body() fxConversionDto: FxConversionDto,
  ): Promise<FxConversionResponse> {
    return this.fxRatesService.convertFx(req, fxConversionDto);
  }
}
