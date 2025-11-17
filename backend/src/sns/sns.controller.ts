import { Controller, Post, Get, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SnsService } from './sns.service';
import { ConnectSnsDto } from './dto/connect-sns.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('SNS')
@Controller('sns')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SnsController {
  constructor(private snsService: SnsService) {}

  @Post('connect')
  @ApiOperation({ summary: 'SNS 계정 연동' })
  async connectSns(@Req() req, @Body() dto: ConnectSnsDto) {
    return this.snsService.connectSns(req.user.userId, dto);
  }

  @Get('stats/:platform')
  @ApiOperation({ summary: 'SNS 통계 조회' })
  async getStats(@Req() req, @Param('platform') platform: string) {
    return this.snsService.getStats(req.user.userId, platform.toUpperCase());
  }

  @Get('portfolio')
  @ApiOperation({ summary: '포트폴리오 조회' })
  async getPortfolio(@Req() req) {
    return this.snsService.getPortfolio(req.user.userId);
  }

  @Post('refresh/:platform')
  @ApiOperation({ summary: 'SNS 통계 새로고침' })
  async refreshStats(@Req() req, @Param('platform') platform: string) {
    return this.snsService.refreshStats(req.user.userId, platform.toUpperCase());
  }
}



