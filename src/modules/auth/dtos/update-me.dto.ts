import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';
import { StringOptional } from 'src/decorators/dto.decorator';

export class UpdateMeDto {
  @StringOptional()
  fullName?: string;

  @StringOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Avatar file',
    required: false,
  })
  avatar?: string;
}