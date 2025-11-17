import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PriceService } from './price.service';
import { CalcPriceDto, CalcAllPricesDto } from './dto/calc-price.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Price')
@Controller('price')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PriceController {
  constructor(private priceService: PriceService) {}

  @Post('calc')
  @ApiOperation({ summary: '광고 단가 계산' })
  async calculatePrice(@Req() req, @Body() dto: CalcPriceDto) {
    return this.priceService.calculatePrice(req.user.userId, dto);
  }

  @Post('calc-all')
  @ApiOperation({ summary: '모든 플랫폼 광고 단가 계산' })
  async calculateAllPrices(@Req() req, @Body() dto: CalcAllPricesDto) {
    return this.priceService.calculateAllPlatforms(req.user.userId, dto.brandType);
  }
}



