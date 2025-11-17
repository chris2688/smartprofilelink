import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class TiktokService {
  private readonly baseUrl = 'https://open.tiktokapis.com/v2';

  async getUserInfo(accessToken: string) {
    try {
      const response = await axios.get(`${this.baseUrl}/user/info/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          fields: 'open_id,display_name',
        },
      });

      return {
        accountId: response.data.data.user.open_id,
        accountName: response.data.data.user.display_name,
      };
    } catch (error) {
      console.error('TikTok getUserInfo error:', error);
      throw new Error('TikTok 사용자 정보를 가져올 수 없습니다.');
    }
  }

  async getStats(accessToken: string) {
    try {
      const response = await axios.get(`${this.baseUrl}/user/info/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          fields: 'follower_count,following_count,likes_count,video_count',
        },
      });

      const userData = response.data.data.user;

      // TikTok API는 평균 데이터를 직접 제공하지 않으므로 추정값 사용
      const followerCount = userData.follower_count || 0;
      const likesCount = userData.likes_count || 0;
      const videoCount = userData.video_count || 1;

      const avgLikes = likesCount / videoCount;
      const engagementRate = followerCount > 0 ? (avgLikes / followerCount) * 100 : 0;

      return {
        followerCount,
        avgLikes,
        avgComments: 0, // TikTok API는 전체 댓글 수를 제공하지 않음
        avgViews: 0,
        engagementRate,
        postFrequency: videoCount,
      };
    } catch (error) {
      console.error('TikTok getStats error:', error);
      return {
        followerCount: 0,
        avgLikes: 0,
        avgComments: 0,
        avgViews: 0,
        engagementRate: 0,
        postFrequency: 0,
      };
    }
  }

  async getRecentVideos(accessToken: string) {
    try {
      const response = await axios.get(`${this.baseUrl}/video/list/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          max_count: 20,
          fields: 'id,title,cover_image_url,share_url,video_description,duration,height,width,create_time,like_count,comment_count,share_count,view_count',
        },
      });

      return (response.data.data.videos || []).map((video) => ({
        contentUrl: video.share_url,
        thumbnailUrl: video.cover_image_url,
        contentType: 'VIDEO',
        caption: video.title || video.video_description || '',
        likes: video.like_count || 0,
        comments: video.comment_count || 0,
        views: video.view_count || 0,
        isSponsored: this.detectSponsored(video.video_description || ''),
        postedAt: new Date(video.create_time * 1000).toISOString(),
      }));
    } catch (error) {
      console.error('TikTok getRecentVideos error:', error);
      return [];
    }
  }

  private detectSponsored(text: string): boolean {
    const keywords = ['#ad', '#sponsored', '#협찬', '#제공', '#partnership', '#프로모션'];
    return keywords.some((keyword) => text.toLowerCase().includes(keyword.toLowerCase()));
  }
}



