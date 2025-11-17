import { Controller, Get, Patch, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('User')
@Controller('user')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  @ApiOperation({ summary: '내 프로필 조회' })
  async getMe(@Req() req) {
    return this.userService.getMe(req.user.userId);
  }

  @Patch('me')
  @ApiOperation({ summary: '내 프로필 수정' })
  async updateMe(@Req() req, @Body() dto: UpdateUserDto) {
    return this.userService.updateMe(req.user.userId, dto);
  }
}



