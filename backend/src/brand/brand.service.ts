import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBrandRequestDto } from './dto/create-brand-request.dto';
import { UpdateBrandRequestDto } from './dto/update-brand-request.dto';

@Injectable()
export class BrandService {
  constructor(private prisma: PrismaService) {}

  async createRequest(username: string, dto: CreateBrandRequestDto) {
    // username으로 사용자 찾기
    const user = await this.prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    const request = await this.prisma.brandRequest.create({
      data: {
        userId: user.id,
        brandName: dto.brandName,
        managerName: dto.managerName,
        managerEmail: dto.managerEmail,
        managerPhone: dto.managerPhone,
        productUrl: dto.productUrl,
        contentType: dto.contentType,
        budget: dto.budget,
        schedule: dto.schedule ? new Date(dto.schedule) : null,
        message: dto.message,
      },
    });

    // 실제로는 여기서 인플루언서에게 알림 전송 (푸시, 이메일 등)
    // TODO: Implement notification system

    return request;
  }

  async getRequests(userId: string) {
    return this.prisma.brandRequest.findMany({
      where: { userId },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getRequest(id: string) {
    return this.prisma.brandRequest.findUnique({
      where: { id },
    });
  }

  async updateRequest(userId: string, id: string, dto: UpdateBrandRequestDto) {
    const request = await this.prisma.brandRequest.findUnique({
      where: { id },
    });

    if (!request || request.userId !== userId) {
      throw new NotFoundException('문의를 찾을 수 없습니다.');
    }

    return this.prisma.brandRequest.update({
      where: { id },
      data: dto,
    });
  }

  async acceptRequest(userId: string, id: string, additionalInfo: any) {
    const request = await this.prisma.brandRequest.findUnique({
      where: { id },
    });

    if (!request || request.userId !== userId) {
      throw new NotFoundException('문의를 찾을 수 없습니다.');
    }

    return this.prisma.brandRequest.update({
      where: { id },
      data: {
        status: 'ACCEPTED',
        shippingAddress: additionalInfo.shippingAddress,
        shootingDate: additionalInfo.shootingDate ? new Date(additionalInfo.shootingDate) : null,
        uploadDeadline: additionalInfo.uploadDeadline ? new Date(additionalInfo.uploadDeadline) : null,
      },
    });
  }

  async rejectRequest(userId: string, id: string) {
    const request = await this.prisma.brandRequest.findUnique({
      where: { id },
    });

    if (!request || request.userId !== userId) {
      throw new NotFoundException('문의를 찾을 수 없습니다.');
    }

    return this.prisma.brandRequest.update({
      where: { id },
      data: {
        status: 'REJECTED',
      },
    });
  }
}



