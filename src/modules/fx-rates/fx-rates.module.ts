import { Module } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
import { FxRatesController } from './fx-rates.controller';
import { FxRatesService } from './fx-rates.service';
import { AuthModule } from '../auth/auth.module';
import { FxRateHelper } from 'src/utils/fx-rate-helper.service';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    AuthModule,
    CacheModule.register()
  ],
  controllers: [FxRatesController],
  providers: [FxRatesService, FxRateHelper],
})
export class FxRatesModule {}
