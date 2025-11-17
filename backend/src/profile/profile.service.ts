import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  async getPublicProfile(username: string) {
    const user = await this.prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        name: true,
        username: true,
        bio: true,
        profileImage: true,
        createdAt: true,
        snsAccounts: {
          include: {
            stats: {
              orderBy: {
                updatedAt: 'desc',
              },
              take: 1,
            },
            portfolio: {
              orderBy: {
                postedAt: 'desc',
              },
              take: 20,
              where: {
                isSponsored: true, // 협찬 콘텐츠만 표시
              },
            },
          },
        },
        proposals: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
          select: {
            id: true,
            title: true,
            pdfUrl: true,
            createdAt: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    // 전체 통계 계산
    const totalFollowers = user.snsAccounts.reduce((sum, account) => {
      return sum + (account.stats[0]?.followerCount || 0);
    }, 0);

    const avgEngagementRate =
      user.snsAccounts.length > 0
        ? user.snsAccounts.reduce((sum, account) => {
            return sum + (account.stats[0]?.engagementRate || 0);
          }, 0) / user.snsAccounts.length
        : 0;

    return {
      user: {
        name: user.name,
        username: user.username,
        bio: user.bio,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
      },
      stats: {
        totalFollowers,
        avgEngagementRate,
        platforms: user.snsAccounts.length,
      },
      snsAccounts: user.snsAccounts.map((account) => ({
        platform: account.platform,
        accountName: account.accountName,
        stats: account.stats[0],
        portfolio: account.portfolio,
      })),
      latestProposal: user.proposals[0] || null,
    };
  }
}



