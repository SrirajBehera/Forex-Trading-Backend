import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsString } from 'class-validator';

export class LoginResponseDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  accessToken: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  email: string;
}
