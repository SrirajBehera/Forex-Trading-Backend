import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { databaseConfig } from './config/database.config';
import { appConfig } from './config/app.config';
import { AuthModule } from './modules/auth/auth.module';
import { AccountsModule } from './modules/accounts/accounts.module';
import { FxRatesModule } from './modules/fx-rates/fx-rates.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, appConfig],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'src', 'modules', 'api', 'public'),
      serveRoot: '/api',
    }),
    MongooseModule.forRoot(databaseConfig().uri),
    AuthModule,
    AccountsModule,
    FxRatesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
