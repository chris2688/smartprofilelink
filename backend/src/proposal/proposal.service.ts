import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PdfService } from './pdf.service';
import { CreateProposalDto } from './dto/create-proposal.dto';

@Injectable()
export class ProposalService {
  constructor(
    private prisma: PrismaService,
    private pdfService: PdfService,
  ) {}

  async createProposal(userId: string, dto: CreateProposalDto) {
    // 사용자 정보 조회
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
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
              take: 10,
            },
          },
        },
      },
    });

    // 제안서 콘텐츠 생성
    const content = {
      title: dto.title || `${user.name} 인플루언서 제안서`,
      user: {
        name: user.name,
        username: user.username,
        bio: user.bio,
        profileImage: user.profileImage,
      },
      snsAccounts: user.snsAccounts.map((account) => ({
        platform: account.platform,
        accountName: account.accountName,
        stats: account.stats[0],
        portfolio: account.portfolio,
      })),
      prices: dto.prices,
      introduction: dto.introduction || this.generateIntroduction(user),
      schedule: dto.schedule,
    };

    // PDF 생성
    const pdfUrl = await this.pdfService.generateProposal(content);

    // DB에 저장
    const proposal = await this.prisma.proposal.create({
      data: {
        userId,
        title: content.title,
        pdfUrl,
        content,
      },
    });

    return proposal;
  }

  async getProposals(userId: string) {
    return this.prisma.proposal.findMany({
      where: { userId },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getProposal(id: string) {
    return this.prisma.proposal.findUnique({
      where: { id },
    });
  }

  private generateIntroduction(user: any): string {
    const platforms = user.snsAccounts.map((acc) => acc.platform).join(', ');
    const totalFollowers = user.snsAccounts.reduce((sum, acc) => {
      return sum + (acc.stats[0]?.followerCount || 0);
    }, 0);

    return `안녕하세요! ${user.name}입니다.\n\n` +
      `저는 ${platforms}에서 활동하고 있는 인플루언서로, 총 ${totalFollowers.toLocaleString()}명의 팔로워와 함께하고 있습니다.\n\n` +
      `${user.bio || '다양한 브랜드와의 협업을 통해 진정성 있는 콘텐츠를 제작하고 있습니다.'}\n\n` +
      `브랜드의 가치를 효과적으로 전달하고, 타겟 고객과의 소통을 이끌어내는 것이 저의 강점입니다.`;
  }
}



