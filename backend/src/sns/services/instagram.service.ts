import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class InstagramService {
  private readonly baseUrl = 'https://graph.instagram.com';

  async getUserInfo(accessToken: string) {
    try {
      const response = await axios.get(`${this.baseUrl}/me`, {
        params: {
          fields: 'id,username',
          access_token: accessToken,
        },
      });

      return {
        accountId: response.data.id,
        accountName: response.data.username,
      };
    } catch (error) {
      console.error('Instagram getUserInfo error:', error);
      throw new Error('Instagram 사용자 정보를 가져올 수 없습니다.');
    }
  }

  async getStats(accessToken: string) {
    try {
      const userInfo = await axios.get(`${this.baseUrl}/me`, {
        params: {
          fields: 'followers_count,media_count',
          access_token: accessToken,
        },
      });

      const media = await axios.get(`${this.baseUrl}/me/media`, {
        params: {
          fields: 'like_count,comments_count,media_type,timestamp',
          limit: 25,
          access_token: accessToken,
        },
      });

      const posts = media.data.data || [];
      const totalLikes = posts.reduce((sum, post) => sum + (post.like_count || 0), 0);
      const totalComments = posts.reduce((sum, post) => sum + (post.comments_count || 0), 0);

      const avgLikes = posts.length > 0 ? totalLikes / posts.length : 0;
      const avgComments = posts.length > 0 ? totalComments / posts.length : 0;
      const followerCount = userInfo.data.followers_count || 0;
      const engagementRate = followerCount > 0 ? ((avgLikes + avgComments) / followerCount) * 100 : 0;

      return {
        followerCount,
        avgLikes,
        avgComments,
        avgViews: 0, // Instagram Graph API는 조회수를 제공하지 않음
        engagementRate,
        postFrequency: userInfo.data.media_count || 0,
      };
    } catch (error) {
      console.error('Instagram getStats error:', error);
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

  async getRecentPosts(accessToken: string) {
    try {
      const response = await axios.get(`${this.baseUrl}/me/media`, {
        params: {
          fields: 'id,caption,media_type,media_url,thumbnail_url,permalink,like_count,comments_count,timestamp',
          limit: 20,
          access_token: accessToken,
        },
      });

      return (response.data.data || []).map((post) => ({
        contentUrl: post.permalink,
        thumbnailUrl: post.thumbnail_url || post.media_url,
        contentType: post.media_type === 'VIDEO' ? 'VIDEO' : 'IMAGE',
        caption: post.caption || '',
        likes: post.like_count || 0,
        comments: post.comments_count || 0,
        views: 0,
        isSponsored: this.detectSponsored(post.caption || ''),
        postedAt: post.timestamp,
      }));
    } catch (error) {
      console.error('Instagram getRecentPosts error:', error);
      return [];
    }
  }

  private detectSponsored(caption: string): boolean {
    const keywords = ['#ad', '#sponsored', '#협찬', '#제공', '#partnership', '#프로모션'];
    return keywords.some((keyword) => caption.toLowerCase().includes(keyword.toLowerCase()));
  }
}



