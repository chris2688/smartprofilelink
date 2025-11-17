import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional } from 'class-validator';

export class CreateBrandRequestDto {
  @ApiProperty()
  @IsString()
  brandName: string;

  @ApiProperty()
  @IsString()
  managerName: string;

  @ApiProperty()
  @IsEmail()
  managerEmail: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  managerPhone?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  productUrl?: string;

  @ApiProperty({ description: '사진, 릴스, 쇼츠, 틱톡 등' })
  @IsString()
  contentType: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  budget?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  schedule?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  message?: string;
}



