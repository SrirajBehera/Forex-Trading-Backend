import { Body, Controller, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
// import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
// import { LocalAuthGuard } from './local-auth.guard';

// @ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

//   @UseGuards(LocalAuthGuard)
  @Post('login')
  @UsePipes(new ValidationPipe())
//   @ApiOperation({ summary: 'Login' })
//   @ApiResponse({ status: 200, type: LoginDto })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  @UsePipes(new ValidationPipe())
//   @ApiOperation({ summary: 'Register' })
//   @ApiResponse({ status: 201, description: 'User registered successfully' })
  async register(@Body() registerDto: RegisterDto) {
    await this.authService.register(registerDto);
    // return { message: 'User registered successfully' };
  }
}
