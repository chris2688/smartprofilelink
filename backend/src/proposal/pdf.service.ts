import { Injectable } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class PdfService {
  async generateProposal(content: any): Promise<string> {
    // PDF 저장 경로 (실제로는 S3나 Supabase Storage에 업로드해야 함)
    const uploadsDir = path.join(process.cwd(), 'uploads', 'proposals');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filename = `proposal-${Date.now()}.pdf`;
    const filepath = path.join(uploadsDir, filename);

    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          size: 'A4',
          margins: {
            top: 50,
            bottom: 50,
            left: 50,
            right: 50,
          },
        });

        const stream = fs.createWriteStream(filepath);
        doc.pipe(stream);

        // 제목
        doc.fontSize(24).text(content.title, { align: 'center' });
        doc.moveDown(2);

        // 프로필 정보
        doc.fontSize(16).text('인플루언서 프로필', { underline: true });
        doc.moveDown(0.5);
        doc.fontSize(12);
        doc.text(`이름: ${content.user.name}`);
        doc.text(`사용자명: @${content.user.username}`);
        if (content.user.bio) {
          doc.text(`소개: ${content.user.bio}`);
        }
        doc.moveDown(2);

        // SNS 통계
        doc.fontSize(16).text('SNS 통계', { underline: true });
        doc.moveDown(0.5);

        content.snsAccounts.forEach((account) => {
          if (account.stats) {
            doc.fontSize(14).text(`${account.platform}`, { bold: true });
            doc.fontSize(12);
            doc.text(`팔로워: ${account.stats.followerCount.toLocaleString()}명`);
            doc.text(`평균 좋아요: ${account.stats.avgLikes.toLocaleString()}`);
            doc.text(`평균 댓글: ${account.stats.avgComments.toLocaleString()}`);
            doc.text(`참여율(ER): ${account.stats.engagementRate.toFixed(2)}%`);
            doc.moveDown(1);
          }
        });

        doc.moveDown(1);

        // 자기소개
        if (content.introduction) {
          doc.fontSize(16).text('인플루언서 소개', { underline: true });
          doc.moveDown(0.5);
          doc.fontSize(12).text(content.introduction);
          doc.moveDown(2);
        }

        // 광고 단가
        if (content.prices) {
          doc.fontSize(16).text('광고 단가', { underline: true });
          doc.moveDown(0.5);
          doc.fontSize(12);

          Object.entries(content.prices).forEach(([type, price]) => {
            doc.text(`${type}: ${(price as number).toLocaleString()}원`);
          });

          doc.moveDown(2);
        }

        // 일정
        if (content.schedule) {
          doc.fontSize(16).text('제안 가능 일정', { underline: true });
          doc.moveDown(0.5);
          doc.fontSize(12).text(content.schedule);
        }

        // 푸터
        doc.moveDown(3);
        doc.fontSize(10).text('이 제안서는 SmartProfileLink에서 자동 생성되었습니다.', {
          align: 'center',
        });

        doc.end();

        stream.on('finish', () => {
          // 실제로는 여기서 S3/Supabase에 업로드하고 public URL 반환
          const publicUrl = `/uploads/proposals/${filename}`;
          resolve(publicUrl);
        });

        stream.on('error', reject);
      } catch (error) {
        reject(error);
      }
    });
  }
}



