import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsObject } from 'class-validator';

export class CreateProposalDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  introduction?: string;

  @ApiProperty({ required: false })
  @IsObject()
  @IsOptional()
  prices?: any;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  schedule?: string;
}



