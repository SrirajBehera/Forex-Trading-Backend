import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginResponseDto } from './dto/login-response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  /**
   * Constructor of AuthController.
   * @param {AuthService} authService - The service for authentication.
   */
  constructor(private authService: AuthService) {}

  /**
   * Logs in a user.
   * @param {LoginDto} loginDto - The DTO containing login details.
   * @returns {Promise<LoginResponseDto>} The response containing JWT access token and user email.
   */
  @Post('login')
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Login User' })
  @ApiResponse({
    status: 200,
    type: LoginResponseDto,
    description: 'Successful user login by generating access token',
  })
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    return this.authService.login(loginDto);
  }

  /**
   * Registers a new user.
   * @param {RegisterDto} registerDto - The DTO containing registration details.
   * @returns {Promise<{ message: string }>} The response indicating successful registration.
   */
  @Post('register')
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Register User' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  async register(@Body() registerDto: RegisterDto): Promise<{ message: string; }> {
    await this.authService.register(registerDto);
    return { message: 'User registered successfully' };
  }
}
