import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional } from 'class-validator';

export class ConnectSnsDto {
  @ApiProperty({ enum: ['INSTAGRAM', 'YOUTUBE', 'TIKTOK'] })
  @IsEnum(['INSTAGRAM', 'YOUTUBE', 'TIKTOK'])
  platform: string;

  @ApiProperty()
  @IsString()
  accessToken: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  refreshToken?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  tokenExpireAt?: string;
}



