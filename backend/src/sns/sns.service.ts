import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InstagramService } from './services/instagram.service';
import { YoutubeService } from './services/youtube.service';
import { TiktokService } from './services/tiktok.service';
import { ConnectSnsDto } from './dto/connect-sns.dto';

@Injectable()
export class SnsService {
  constructor(
    private prisma: PrismaService,
    private instagramService: InstagramService,
    private youtubeService: YoutubeService,
    private tiktokService: TiktokService,
  ) {}

  // OAuth를 통한 Instagram 계정 저장
  async saveInstagramAccount(userId: string, data: {
    instagramUserId: string;
    accessToken: string;
    accountName: string;
    followerCount: number;
    avgLikes: number;
    avgComments: number;
    avgViews: number;
    engagementRate: number;
    postFrequency: number;
  }) {
    // SNS 계정 저장
    const snsAccount = await this.prisma.sNSAccount.upsert({
      where: {
        userId_platform: {
          userId,
          platform: 'INSTAGRAM',
        },
      },
      update: {
        accountName: data.accountName,
        accountId: data.instagramUserId,
        accessToken: data.accessToken,
        tokenExpireAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60일 후
      },
      create: {
        userId,
        platform: 'INSTAGRAM',
        accountName: data.accountName,
        accountId: data.instagramUserId,
        accessToken: data.accessToken,
        tokenExpireAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60일 후
      },
    });

    // 통계 정보 저장
    await this.prisma.sNSStats.create({
      data: {
        snsAccountId: snsAccount.id,
        followerCount: data.followerCount,
        avgLikes: data.avgLikes,
        avgComments: data.avgComments,
        avgViews: data.avgViews,
        engagementRate: data.engagementRate,
        postFrequency: data.postFrequency,
      },
    });

    // 포트폴리오 콘텐츠 저장
    await this.updatePortfolio(snsAccount.id, 'INSTAGRAM', data.accessToken);

    return snsAccount;
  }

  async connectSns(userId: string, dto: ConnectSnsDto) {
    const { platform, accessToken } = dto;

    let snsData;
    switch (platform) {
      case 'INSTAGRAM':
        snsData = await this.instagramService.getUserInfo(accessToken);
        break;
      case 'YOUTUBE':
        snsData = await this.youtubeService.getChannelInfo(accessToken);
        break;
      case 'TIKTOK':
        snsData = await this.tiktokService.getUserInfo(accessToken);
        break;
      default:
        throw new BadRequestException('지원하지 않는 플랫폼입니다.');
    }

    // SNS 계정 저장
    const snsAccount = await this.prisma.sNSAccount.upsert({
      where: {
        userId_platform: {
          userId,
          platform,
        },
      },
      update: {
        accountName: snsData.accountName,
        accountId: snsData.accountId,
        accessToken,
        refreshToken: dto.refreshToken,
        tokenExpireAt: dto.tokenExpireAt ? new Date(dto.tokenExpireAt) : null,
      },
      create: {
        userId,
        platform,
        accountName: snsData.accountName,
        accountId: snsData.accountId,
        accessToken,
        refreshToken: dto.refreshToken,
        tokenExpireAt: dto.tokenExpireAt ? new Date(dto.tokenExpireAt) : null,
      },
    });

    // 통계 정보 저장
    await this.updateStats(snsAccount.id, platform, accessToken);

    // 포트폴리오 콘텐츠 저장
    await this.updatePortfolio(snsAccount.id, platform, accessToken);

    return snsAccount;
  }

  async getStats(userId: string, platform: string) {
    const snsAccount = await this.prisma.sNSAccount.findUnique({
      where: {
        userId_platform: {
          userId,
          platform: platform as any,
        },
      },
      include: {
        stats: {
          orderBy: {
            updatedAt: 'desc',
          },
          take: 1,
        },
      },
    });

    return snsAccount;
  }

  async getPortfolio(userId: string) {
    const snsAccounts = await this.prisma.sNSAccount.findMany({
      where: { userId },
      include: {
        portfolio: {
          orderBy: {
            postedAt: 'desc',
          },
          take: 20,
        },
        stats: {
          orderBy: {
            updatedAt: 'desc',
          },
          take: 1,
        },
      },
    });

    return snsAccounts;
  }

  async refreshStats(userId: string, platform: string) {
    const snsAccount = await this.prisma.sNSAccount.findUnique({
      where: {
        userId_platform: {
          userId,
          platform: platform as any,
        },
      },
    });

    if (!snsAccount) {
      throw new BadRequestException('연동된 SNS 계정이 없습니다.');
    }

    await this.updateStats(snsAccount.id, platform as any, snsAccount.accessToken);
    await this.updatePortfolio(snsAccount.id, platform as any, snsAccount.accessToken);

    return { message: '통계 정보가 업데이트되었습니다.' };
  }

  private async updateStats(snsAccountId: string, platform: string, accessToken: string) {
    let stats;
    switch (platform) {
      case 'INSTAGRAM':
        stats = await this.instagramService.getStats(accessToken);
        break;
      case 'YOUTUBE':
        stats = await this.youtubeService.getStats(accessToken);
        break;
      case 'TIKTOK':
        stats = await this.tiktokService.getStats(accessToken);
        break;
      default:
        return;
    }

    await this.prisma.sNSStats.create({
      data: {
        snsAccountId,
        followerCount: stats.followerCount,
        avgLikes: stats.avgLikes,
        avgComments: stats.avgComments,
        avgViews: stats.avgViews,
        engagementRate: stats.engagementRate,
        postFrequency: stats.postFrequency,
      },
    });
  }

  private async updatePortfolio(snsAccountId: string, platform: string, accessToken: string) {
    let contents;
    switch (platform) {
      case 'INSTAGRAM':
        contents = await this.instagramService.getRecentPosts(accessToken);
        break;
      case 'YOUTUBE':
        contents = await this.youtubeService.getRecentVideos(accessToken);
        break;
      case 'TIKTOK':
        contents = await this.tiktokService.getRecentVideos(accessToken);
        break;
      default:
        return;
    }

    // 기존 콘텐츠 삭제
    await this.prisma.portfolioContent.deleteMany({
      where: { snsAccountId },
    });

    // 새 콘텐츠 저장
    for (const content of contents) {
      await this.prisma.portfolioContent.create({
        data: {
          snsAccountId,
          platform: platform as any,
          contentUrl: content.contentUrl,
          thumbnailUrl: content.thumbnailUrl,
          contentType: content.contentType,
          caption: content.caption,
          likes: content.likes,
          comments: content.comments,
          views: content.views,
          isSponsored: content.isSponsored,
          postedAt: new Date(content.postedAt),
        },
      });
    }
  }
}



