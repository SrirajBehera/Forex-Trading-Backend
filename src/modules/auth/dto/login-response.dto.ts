import { ApiProperty } from '@nestjs/swagger';

import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginResponseDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  accessToken: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  @IsEmail()
  email: string;
}
