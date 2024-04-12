// register.dto.ts
// import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsString } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  //   @ApiProperty()
  email: string;

  @IsNotEmpty()
  @IsString()
  //   @ApiProperty()
  password: string;
}
