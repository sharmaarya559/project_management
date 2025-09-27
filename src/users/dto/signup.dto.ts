import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class SignUpDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
    type: String,
    description: 'First name',
  })
  first_name: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    type: String,
    description: 'Last name',
  })
  last_name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    required: true,
    type: String,
    description: 'Email',
  })
  email: string;

  @IsString()
  @IsStrongPassword()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
    type: String,
    description: 'Password',
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
    type: String,
    description: 'Confirm your password',
  })
  confirm_password: string;
}
