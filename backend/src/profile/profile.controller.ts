import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ProfileService } from './profile.service';

@ApiTags('Profile')
@Controller('profile')
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Get(':username')
  @ApiOperation({ summary: '공개 프로필 조회 (스마트 링크)' })
  async getPublicProfile(@Param('username') username: string) {
    return this.profileService.getPublicProfile(username);
  }
}



