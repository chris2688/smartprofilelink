import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
        bio: true,
        profileImage: true,
        phoneNumber: true,
        planType: true,
        planExpireAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    return user;
  }

  async updateMe(userId: string, dto: UpdateUserDto) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: dto,
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
        bio: true,
        profileImage: true,
        phoneNumber: true,
        planType: true,
        planExpireAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  async updatePlan(userId: string, planType: string, expireAt: Date) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        planType: planType as any,
        planExpireAt: expireAt,
      },
    });

    return user;
  }
}



