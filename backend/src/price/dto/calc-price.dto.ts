import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';

export class CalcPriceDto {
  @ApiProperty({ enum: ['INSTAGRAM', 'YOUTUBE', 'TIKTOK'] })
  @IsEnum(['INSTAGRAM', 'YOUTUBE', 'TIKTOK'])
  platform: string;

  @ApiProperty({ enum: ['large', 'medium', 'small'], description: '대기업/중소기업/쇼핑몰' })
  @IsEnum(['large', 'medium', 'small'])
  brandType: string;
}

export class CalcAllPricesDto {
  @ApiProperty({ enum: ['large', 'medium', 'small'], description: '대기업/중소기업/쇼핑몰' })
  @IsEnum(['large', 'medium', 'small'])
  brandType: string;
}



