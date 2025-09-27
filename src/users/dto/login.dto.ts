import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    required: true,
    type: String,
    description: 'Email',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
    type: String,
    description: 'Password',
  })
  password: string;
}
