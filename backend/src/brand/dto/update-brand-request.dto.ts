import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional } from 'class-validator';

export class UpdateBrandRequestDto {
  @ApiProperty({ enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED'], required: false })
  @IsEnum(['PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED'])
  @IsOptional()
  status?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  shippingAddress?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  shootingDate?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  uploadDeadline?: string;
}



