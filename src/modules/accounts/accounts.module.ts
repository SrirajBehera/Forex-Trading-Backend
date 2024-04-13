import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { User, UserSchema } from '../auth/user.entity';
import { AuthModule } from '../auth/auth.module';
import { CurrencyValidatorService } from 'src/utils/currency-validator.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    AuthModule,
  ],
  controllers: [AccountsController],
  providers: [AccountsService, CurrencyValidatorService],
})
export class AccountsModule {}
