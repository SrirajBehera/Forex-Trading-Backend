import { Body, Controller, Get, Post, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
// import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FxRatesService } from './fx-rates.service';
import { FxConversionDto } from './dto/fx-conversion.dto';
// import { FxConversionResponse } from './dto/fx-conversion-response.dto';
// import { FxRateResponse } from './dto/fx-rate-response.dto';
import { AuthGuard } from '@nestjs/passport';
import { FxRatesDto } from './dto/fx-rate.dto';
import { Request } from 'express';

// @ApiTags('FX Rates')
@Controller()
@UseGuards(AuthGuard('jwt'))
export class FxRatesController {
  constructor(private readonly fxRatesService: FxRatesService) {}

  @Get('fx-rates')
  @UsePipes(new ValidationPipe())
  //   @ApiOperation({ summary: 'Get FX rates' })
  //   @ApiResponse({ status: 200, type: FxRateResponse })
  async getFxRate(@Body() FxRatesDto: FxRatesDto) {
    return this.fxRatesService.getFxRate(FxRatesDto);
  }

  @Post('fx-conversion')
  @UsePipes(new ValidationPipe())
  //   @ApiOperation({ summary: 'Perform FX conversion' })
  //   @ApiResponse({ status: 200, type: FxConversionResponse })
  convertFx(@Req() req: Request, @Body() fxConversionDto: FxConversionDto) {
    return this.fxRatesService.convertFx(req, fxConversionDto);
  }
}
