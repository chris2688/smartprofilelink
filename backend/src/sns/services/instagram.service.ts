import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class InstagramService {
  private readonly baseUrl = 'https://graph.instagram.com';

  constructor(private configService: ConfigService) {}

  /**
   * OAuth 인증 URL 생성
   */
  getAuthUrl(state: string): string {
    const appId = this.configService.get('INSTAGRAM_APP_ID');
    const redirectUri = this.configService.get('INSTAGRAM_REDIRECT_URI');
    
    if (!appId || !redirectUri) {
      throw new HttpException(
        'Instagram API 설정이 필요합니다. INSTAGRAM_APP_ID와 INSTAGRAM_REDIRECT_URI를 .env에 설정하세요.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const params = new URLSearchParams({
      client_id: appId,
      redirect_uri: redirectUri,
      scope: 'user_profile,user_media',
      response_type: 'code',
      state,
    });

    return `https://api.instagram.com/oauth/authorize?${params.toString()}`;
  }

  /**
   * Authorization Code를 Access Token으로 교환
   */
  async exchangeCodeForToken(code: string): Promise<{
    accessToken: string;
    userId: string;
  }> {
    try {
      const appId = this.configService.get('INSTAGRAM_APP_ID');
      const appSecret = this.configService.get('INSTAGRAM_APP_SECRET');
      const redirectUri = this.configService.get('INSTAGRAM_REDIRECT_URI');

      if (!appId || !appSecret || !redirectUri) {
        throw new HttpException(
          'Instagram API 설정이 완료되지 않았습니다.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const formData = new URLSearchParams({
        client_id: appId,
        client_secret: appSecret,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
        code,
      });

      const response = await axios.post(
        'https://api.instagram.com/oauth/access_token',
        formData.toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      const { access_token, user_id } = response.data;

      // Short-lived token을 Long-lived token으로 교환
      const longLivedToken = await this.exchangeForLongLivedToken(access_token);

      return {
        accessToken: longLivedToken,
        userId: user_id.toString(),
      };
    } catch (error) {
      console.error('Instagram token exchange error:', error.response?.data || error.message);
      throw new HttpException(
        'Instagram 인증 실패: ' + (error.response?.data?.error_message || error.message),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Short-lived Token을 Long-lived Token으로 교환 (60일)
   */
  async exchangeForLongLivedToken(shortLivedToken: string): Promise<string> {
    try {
      const appSecret = this.configService.get('INSTAGRAM_APP_SECRET');

      const params = new URLSearchParams({
        grant_type: 'ig_exchange_token',
        client_secret: appSecret,
        access_token: shortLivedToken,
      });

      const response = await axios.get(
        `${this.baseUrl}/access_token?${params.toString()}`,
      );

      return response.data.access_token;
    } catch (error) {
      console.error('Long-lived token exchange error:', error);
      // Long-lived token 교환 실패 시 short-lived token 반환
      return shortLivedToken;
    }
  }

  /**
   * Access Token 갱신 (60일 연장)
   */
  async refreshToken(accessToken: string): Promise<string> {
    try {
      const params = new URLSearchParams({
        grant_type: 'ig_refresh_token',
        access_token: accessToken,
      });

      const response = await axios.get(
        `${this.baseUrl}/refresh_access_token?${params.toString()}`,
      );

      return response.data.access_token;
    } catch (error) {
      console.error('Token refresh error:', error);
      throw new HttpException(
        'Token 갱신 실패',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

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



