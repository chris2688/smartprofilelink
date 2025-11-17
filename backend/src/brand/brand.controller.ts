import { Controller, Post, Get, Patch, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BrandService } from './brand.service';
import { CreateBrandRequestDto } from './dto/create-brand-request.dto';
import { UpdateBrandRequestDto } from './dto/update-brand-request.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Brand')
@Controller('brand')
export class BrandController {
  constructor(private brandService: BrandService) {}

  @Post('request/:username')
  @ApiOperation({ summary: '브랜드 문의 생성 (Public)' })
  async createRequest(@Param('username') username: string, @Body() dto: CreateBrandRequestDto) {
    return this.brandService.createRequest(username, dto);
  }

  @Get('requests')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '내 브랜드 문의 목록 조회' })
  async getRequests(@Req() req) {
    return this.brandService.getRequests(req.user.userId);
  }

  @Get('request/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '브랜드 문의 상세 조회' })
  async getRequest(@Param('id') id: string) {
    return this.brandService.getRequest(id);
  }

  @Patch('request/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '브랜드 문의 수정' })
  async updateRequest(@Req() req, @Param('id') id: string, @Body() dto: UpdateBrandRequestDto) {
    return this.brandService.updateRequest(req.user.userId, id, dto);
  }

  @Post('request/:id/accept')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '브랜드 문의 승인' })
  async acceptRequest(@Req() req, @Param('id') id: string, @Body() additionalInfo: any) {
    return this.brandService.acceptRequest(req.user.userId, id, additionalInfo);
  }

  @Post('request/:id/reject')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '브랜드 문의 거절' })
  async rejectRequest(@Req() req, @Param('id') id: string) {
    return this.brandService.rejectRequest(req.user.userId, id);
  }
}



