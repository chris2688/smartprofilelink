import { Controller, Post, Get, Body, Param, UseGuards, Req, Query, Res, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { Response } from 'express';
import { SnsService } from './sns.service';
import { ConnectSnsDto } from './dto/connect-sns.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { InstagramService } from './services/instagram.service';

@ApiTags('SNS')
@Controller('sns')
export class SnsController {
  constructor(
    private snsService: SnsService,
    private instagramService: InstagramService,
  ) {}

  // Instagram OAuth 인증 시작 (JWT 인증 불필요 - 리디렉션)
  @Get('instagram/auth')
  @ApiOperation({ summary: 'Instagram OAuth 인증 시작' })
  @ApiQuery({ name: 'userId', required: true, description: '사용자 ID' })
  async instagramAuth(@Query('userId') userId: string, @Res() res: Response) {
    // state 파라미터에 userId를 인코딩하여 전달
    const state = Buffer.from(JSON.stringify({ userId })).toString('base64');
    const authUrl = this.instagramService.getAuthUrl(state);
    return res.redirect(authUrl);
  }

  // Instagram OAuth 콜백 (JWT 인증 불필요 - Instagram에서 호출)
  @Get('instagram/callback')
  @ApiOperation({ summary: 'Instagram OAuth 콜백' })
  async instagramCallback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Query('error') error: string,
    @Res() res: Response,
  ) {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:8080';

    // 사용자가 인증 거부한 경우
    if (error) {
      return res.redirect(`${frontendUrl}/sns-connect?error=access_denied`);
    }

    try {
      // state에서 userId 추출
      const { userId } = JSON.parse(Buffer.from(state, 'base64').toString());

      // Authorization code를 access token으로 교환
      const { accessToken, userId: instagramUserId } =
        await this.instagramService.exchangeCodeForToken(code);

      // 사용자 정보 및 통계 조회
      const userInfo = await this.instagramService.getUserInfo(accessToken);
      const stats = await this.instagramService.getStats(accessToken);

      // DB에 저장
      await this.snsService.saveInstagramAccount(userId, {
        instagramUserId,
        accessToken,
        accountName: userInfo.accountName,
        ...stats,
      });

      // 성공 시 프론트엔드로 리디렉션
      return res.redirect(`${frontendUrl}/sns-connect?success=true&platform=instagram`);
    } catch (error) {
      console.error('Instagram callback error:', error);
      return res.redirect(`${frontendUrl}/sns-connect?error=callback_failed`);
    }
  }

  // 기존 연동 방식 (access token을 직접 받는 방식 - 테스트용)
  @Post('connect')
  @ApiOperation({ summary: 'SNS 계정 연동 (테스트용)' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async connectSns(@Req() req, @Body() dto: ConnectSnsDto) {
    return this.snsService.connectSns(req.user.userId, dto);
  }

  @Get('stats/:platform')
  @ApiOperation({ summary: 'SNS 통계 조회' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getStats(@Req() req, @Param('platform') platform: string) {
    return this.snsService.getStats(req.user.userId, platform.toUpperCase());
  }

  @Get('portfolio')
  @ApiOperation({ summary: '포트폴리오 조회' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getPortfolio(@Req() req) {
    return this.snsService.getPortfolio(req.user.userId);
  }

  @Post('refresh/:platform')
  @ApiOperation({ summary: 'SNS 통계 새로고침' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async refreshStats(@Req() req, @Param('platform') platform: string) {
    return this.snsService.refreshStats(req.user.userId, platform.toUpperCase());
  }
}



