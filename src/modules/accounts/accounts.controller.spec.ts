import { Test, TestingModule } from '@nestjs/testing';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { TopUpAccountDto } from './dto/top-up-account.dto';
import { GetAccountBalanceResponse } from './dto/account-balance.dto';
import { TopUpAccountResponseDto } from './dto/top-up-account-response.dto';
import { UserDocument } from '../auth/user.entity';

describe('AccountsController', () => {
  let accountsController: AccountsController;
  let accountsService: AccountsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountsController],
      providers: [
        {
          provide: AccountsService,
          useValue: {
            topUpAccount: jest.fn(),
            getAccountBalance: jest.fn(),
            getCurrencyBalance: jest.fn(),
          },
        },
      ],
    }).compile();

    accountsController = module.get<AccountsController>(AccountsController);
    accountsService = module.get<AccountsService>(AccountsService);
  });

  describe('topUpAccount', () => {
    it('should top up the account', async () => {
      const topUpAccountDto: TopUpAccountDto = {
        currency: 'USD',
        amount: 100,
      };
      const user: UserDocument = {
        email: 'test@example.com',
        balances: new Map([['USD', 1000]]),
      } as UserDocument;
      const expectedResponse: TopUpAccountResponseDto = {
        email: 'test@example.com',
        balances: new Map([['USD', 1100]]),
      };

      jest
        .spyOn(accountsService, 'topUpAccount')
        .mockResolvedValue(expectedResponse);

      const response = await accountsController.topUpAccount(topUpAccountDto, {
        user,
      });
      expect(response).toEqual(expectedResponse);
      expect(accountsService.topUpAccount).toHaveBeenCalledWith(
        topUpAccountDto,
        user.email,
      );
    });
  });

  describe('getAccountBalance', () => {
    it('should return the account balance', async () => {
      const user: UserDocument = {
        email: 'test@example.com',
        balances: new Map([
          ['USD', 1000],
          ['EUR', 500],
          ['GBP', 300],
        ]),
      } as UserDocument;
      const expectedResponse: GetAccountBalanceResponse = {
        balances: new Map([
          ['USD', 1000],
          ['EUR', 500],
          ['GBP', 300],
        ]),
      };

      jest
        .spyOn(accountsService, 'getAccountBalance')
        .mockResolvedValue(expectedResponse);

      const response = await accountsController.getAccountBalance({ user });
      expect(response).toEqual(expectedResponse);
      expect(accountsService.getAccountBalance).toHaveBeenCalledWith(
        user.email,
      );
    });
  });
});
