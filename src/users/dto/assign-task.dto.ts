import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AssignTaskDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    required: true,
    type: String,
    description: 'User id',
  })
  user_id: string;
}
