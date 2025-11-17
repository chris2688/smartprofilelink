import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { SnsModule } from './sns/sns.module';
import { PriceModule } from './price/price.module';
import { ProposalModule } from './proposal/proposal.module';
import { BrandModule } from './brand/brand.module';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    SnsModule,
    PriceModule,
    ProposalModule,
    BrandModule,
    ProfileModule,
  ],
})
export class AppModule {}



