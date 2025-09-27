import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateProjectDto } from './create-project.dto';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateProjectDto extends PartialType(CreateProjectDto) {
  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    type: Boolean,
    description: 'Status',
  })
  status: boolean;
}
