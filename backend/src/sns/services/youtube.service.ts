import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class YoutubeService {
  private readonly baseUrl = 'https://www.googleapis.com/youtube/v3';

  constructor(private config: ConfigService) {}

  async getChannelInfo(accessToken: string) {
    try {
      const response = await axios.get(`${this.baseUrl}/channels`, {
        params: {
          part: 'snippet',
          mine: true,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const channel = response.data.items[0];
      return {
        accountId: channel.id,
        accountName: channel.snippet.title,
      };
    } catch (error) {
      console.error('YouTube getChannelInfo error:', error);
      throw new Error('YouTube 채널 정보를 가져올 수 없습니다.');
    }
  }

  async getStats(accessToken: string) {
    try {
      const channelResponse = await axios.get(`${this.baseUrl}/channels`, {
        params: {
          part: 'statistics',
          mine: true,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const stats = channelResponse.data.items[0].statistics;

      const videosResponse = await axios.get(`${this.baseUrl}/search`, {
        params: {
          part: 'id',
          forMine: true,
          type: 'video',
          maxResults: 25,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const videoIds = videosResponse.data.items.map((item) => item.id.videoId).join(',');

      const videoStats = await axios.get(`${this.baseUrl}/videos`, {
        params: {
          part: 'statistics',
          id: videoIds,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const videos = videoStats.data.items || [];
      const totalLikes = videos.reduce((sum, video) => sum + parseInt(video.statistics.likeCount || '0'), 0);
      const totalComments = videos.reduce((sum, video) => sum + parseInt(video.statistics.commentCount || '0'), 0);
      const totalViews = videos.reduce((sum, video) => sum + parseInt(video.statistics.viewCount || '0'), 0);

      const avgLikes = videos.length > 0 ? totalLikes / videos.length : 0;
      const avgComments = videos.length > 0 ? totalComments / videos.length : 0;
      const avgViews = videos.length > 0 ? totalViews / videos.length : 0;

      const subscriberCount = parseInt(stats.subscriberCount || '0');
      const engagementRate = subscriberCount > 0 ? ((avgLikes + avgComments) / subscriberCount) * 100 : 0;

      return {
        followerCount: subscriberCount,
        avgLikes,
        avgComments,
        avgViews,
        engagementRate,
        postFrequency: parseInt(stats.videoCount || '0'),
      };
    } catch (error) {
      console.error('YouTube getStats error:', error);
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
      const searchResponse = await axios.get(`${this.baseUrl}/search`, {
        params: {
          part: 'id',
          forMine: true,
          type: 'video',
          maxResults: 20,
          order: 'date',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const videoIds = searchResponse.data.items.map((item) => item.id.videoId).join(',');

      const videoDetails = await axios.get(`${this.baseUrl}/videos`, {
        params: {
          part: 'snippet,statistics',
          id: videoIds,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return (videoDetails.data.items || []).map((video) => ({
        contentUrl: `https://www.youtube.com/watch?v=${video.id}`,
        thumbnailUrl: video.snippet.thumbnails.high.url,
        contentType: 'VIDEO',
        caption: video.snippet.title,
        likes: parseInt(video.statistics.likeCount || '0'),
        comments: parseInt(video.statistics.commentCount || '0'),
        views: parseInt(video.statistics.viewCount || '0'),
        isSponsored: this.detectSponsored(video.snippet.title + ' ' + video.snippet.description),
        postedAt: video.snippet.publishedAt,
      }));
    } catch (error) {
      console.error('YouTube getRecentVideos error:', error);
      return [];
    }
  }

  private detectSponsored(text: string): boolean {
    const keywords = ['#ad', '#sponsored', '#협찬', '#제공', '#partnership', '#프로모션', 'sponsored by'];
    return keywords.some((keyword) => text.toLowerCase().includes(keyword.toLowerCase()));
  }
}



