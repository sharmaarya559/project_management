import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProjectDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    required: true,
    type: String,
    description: 'Title',
  })
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
    type: String,
    description: 'Description',
  })
  description: string;
}
