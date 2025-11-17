import { Controller, Post, Get, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProposalService } from './proposal.service';
import { CreateProposalDto } from './dto/create-proposal.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Proposal')
@Controller('proposal')
export class ProposalController {
  constructor(private proposalService: ProposalService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '제안서 생성' })
  async create(@Req() req, @Body() dto: CreateProposalDto) {
    return this.proposalService.createProposal(req.user.userId, dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '내 제안서 목록 조회' })
  async getAll(@Req() req) {
    return this.proposalService.getProposals(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: '제안서 상세 조회' })
  async getOne(@Param('id') id: string) {
    return this.proposalService.getProposal(id);
  }
}



