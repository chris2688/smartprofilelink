import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CalcPriceDto } from './dto/calc-price.dto';

@Injectable()
export class PriceService {
  constructor(private prisma: PrismaService) {}

  async calculatePrice(userId: string, dto: CalcPriceDto) {
    // SNS 통계 가져오기
    const snsAccount = await this.prisma.sNSAccount.findUnique({
      where: {
        userId_platform: {
          userId,
          platform: dto.platform as any,
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

    if (!snsAccount || !snsAccount.stats[0]) {
      throw new Error('SNS 통계 정보가 없습니다.');
    }

    const stats = snsAccount.stats[0];

    // 기본 단가 계산
    const basePrice = stats.followerCount * 0.05;

    // ER 보너스 (ER이 높을수록 가중치 증가)
    let erWeight = 1.0;
    if (stats.engagementRate > 5) erWeight = 1.5;
    else if (stats.engagementRate > 3) erWeight = 1.3;
    else if (stats.engagementRate > 2) erWeight = 1.2;

    const engageBonus = basePrice * (erWeight - 1);

    // 조회수 보너스 (평균 조회수 / 팔로워 수 비율)
    const viewRatio = stats.followerCount > 0 ? stats.avgViews / stats.followerCount : 0;
    let viewWeight = 1.0;
    if (viewRatio > 2) viewWeight = 1.3;
    else if (viewRatio > 1.5) viewWeight = 1.2;
    else if (viewRatio > 1) viewWeight = 1.1;

    const viewBonus = basePrice * (viewWeight - 1);

    // 브랜드 등급 가중치
    const brandGrades = {
      large: 1.3, // 대기업 +30%
      medium: 1.15, // 중소기업 +15%
      small: 1.0, // 쇼핑몰/스타트업
    };

    const brandGrade = brandGrades[dto.brandType] || 1.0;

    // 최종 단가
    const totalBonus = engageBonus + viewBonus;
    const baseTotal = basePrice + totalBonus;

    // 콘텐츠 유형별 단가
    const prices = {
      image: Math.round(baseTotal * brandGrade),
      reel: Math.round(baseTotal * 1.5 * brandGrade), // 릴스는 50% 추가
      short: Math.round(baseTotal * 1.5 * brandGrade), // 쇼츠는 50% 추가
      video: Math.round(baseTotal * 2.0 * brandGrade), // 일반 영상은 100% 추가
      package: Math.round(baseTotal * 2.5 * brandGrade), // 패키지는 150% 추가
    };

    return {
      platform: dto.platform,
      stats: {
        followerCount: stats.followerCount,
        engagementRate: stats.engagementRate,
        avgLikes: stats.avgLikes,
        avgComments: stats.avgComments,
        avgViews: stats.avgViews,
      },
      calculation: {
        basePrice: Math.round(basePrice),
        engageBonus: Math.round(engageBonus),
        viewBonus: Math.round(viewBonus),
        brandGrade,
      },
      prices,
    };
  }

  async calculateAllPlatforms(userId: string, brandType: string) {
    const snsAccounts = await this.prisma.sNSAccount.findMany({
      where: { userId },
      include: {
        stats: {
          orderBy: {
            updatedAt: 'desc',
          },
          take: 1,
        },
      },
    });

    const results = [];

    for (const account of snsAccounts) {
      if (account.stats.length > 0) {
        try {
          const price = await this.calculatePrice(userId, {
            platform: account.platform,
            brandType,
          });
          results.push(price);
        } catch (error) {
          console.error(`Error calculating price for ${account.platform}:`, error);
        }
      }
    }

    return results;
  }
}



