import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
            register: jest.fn(),
            getUserEmailFromToken: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('login', () => {
    it('should return a login response', async () => {
      const loginDto: LoginDto = { email: 'test@example.com', password: 'password' };
      const loginResponseDto: LoginResponseDto = {
        accessToken: 'access_token',
        email: 'test@example.com',
      };

      jest.spyOn(authService, 'login').mockResolvedValue(loginResponseDto);

      const result = await controller.login(loginDto);
      expect(result).toEqual(loginResponseDto);
      expect(authService.login).toHaveBeenCalledWith(loginDto);
    });

    it('should throw an UnauthorizedException when login fails', async () => {
      const loginDto: LoginDto = { email: 'test@example.com', password: 'wrong_password' };

      jest.spyOn(authService, 'login').mockRejectedValue(new UnauthorizedException());

      await expect(controller.login(loginDto)).rejects.toThrow(UnauthorizedException);
      expect(authService.login).toHaveBeenCalledWith(loginDto);
    });
  });

  describe('register', () => {
    it('should register a user successfully', async () => {
      const registerDto: RegisterDto = { email: 'test@example.com', password: 'password' };
      const response = { message: 'User registered successfully' };

      jest.spyOn(authService, 'register').mockResolvedValue({ email: 'test@example.com' });

      const result = await controller.register(registerDto);
      expect(result).toEqual(response);
      expect(authService.register).toHaveBeenCalledWith(registerDto);
    });
  });

  describe('getUserEmailFromToken', () => {
    it('should return the user email from the JWT token', async () => {
      const authHeader = 'Bearer access_token';
      const email = 'test@example.com';

      jest.spyOn(authService, 'getUserEmailFromToken').mockResolvedValue(email);

      const result = await authService.getUserEmailFromToken(authHeader);
      expect(result).toEqual(email);
      expect(authService.getUserEmailFromToken).toHaveBeenCalledWith(authHeader);
    });

    it('should throw an UnauthorizedException when the JWT token is invalid', async () => {
      const authHeader = 'Bearer invalid_token';

      jest.spyOn(authService, 'getUserEmailFromToken').mockRejectedValue(new UnauthorizedException());

      await expect(authService.getUserEmailFromToken(authHeader)).rejects.toThrow(UnauthorizedException);
      expect(authService.getUserEmailFromToken).toHaveBeenCalledWith(authHeader);
    });
  });
});