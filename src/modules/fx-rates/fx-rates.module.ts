import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FxRatesController } from './fx-rates.controller';
import { FxRatesService } from './fx-rates.service';
import { AuthModule } from '../auth/auth.module';
import { FxRateHelper } from 'src/utils/fx-rate-helper.service';
import { CacheModule } from '@nestjs/cache-manager';
import { AccountsService } from '../accounts/accounts.service';
import { User, UserSchema } from '../auth/user.entity';
import { CurrencyValidatorService } from 'src/utils/currency-validator.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    AuthModule,
    CacheModule.register(),
  ],
  controllers: [FxRatesController],
  providers: [FxRatesService, FxRateHelper, AccountsService, CurrencyValidatorService],
})
export class FxRatesModule {}
