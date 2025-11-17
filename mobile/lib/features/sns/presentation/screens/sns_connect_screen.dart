import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../../../core/services/storage_service.dart';
import '../../data/models/sns_account.dart';
import '../../data/repositories/sns_repository.dart';

// Provider
final snsRepositoryProvider = Provider<SnsRepository>((ref) => SnsRepository());

final snsAccountsProvider = FutureProvider<List<SnsAccount>>((ref) async {
  final repo = ref.watch(snsRepositoryProvider);
  return await repo.getConnectedAccounts();
});

class SnsConnectScreen extends ConsumerStatefulWidget {
  const SnsConnectScreen({super.key});

  @override
  ConsumerState<SnsConnectScreen> createState() => _SnsConnectScreenState();
}

class _SnsConnectScreenState extends ConsumerState<SnsConnectScreen> {
  bool _isLoading = false;

  @override
  Widget build(BuildContext context) {
    final accountsAsync = ref.watch(snsAccountsProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('SNS 연동'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () {
              ref.invalidate(snsAccountsProvider);
            },
          ),
        ],
      ),
      body: accountsAsync.when(
        data: (accounts) => _buildBody(context, accounts),
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (error, stack) => Center(
          child: Text('오류: $error'),
        ),
      ),
    );
  }

  Widget _buildBody(BuildContext context, List<SnsAccount> accounts) {
    final instagramAccount =
        accounts.where((a) => a.platform == 'Instagram').firstOrNull;
    final youtubeAccount =
        accounts.where((a) => a.platform == 'YouTube').firstOrNull;
    final tiktokAccount =
        accounts.where((a) => a.platform == 'TikTok').firstOrNull;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'SNS 계정 연동',
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Instagram, YouTube, TikTok 계정을 연동하여\n통계를 자동으로 수집하세요',
            style: TextStyle(
              fontSize: 14,
              color: Colors.grey[600],
            ),
          ),
          const SizedBox(height: 32),
          _buildSnsCard(
            context,
            platform: 'Instagram',
            icon: Icons.camera_alt,
            color: const Color(0xFFE1306C),
            account: instagramAccount,
          ),
          const SizedBox(height: 16),
          _buildSnsCard(
            context,
            platform: 'YouTube',
            icon: Icons.play_circle_filled,
            color: const Color(0xFFFF0000),
            account: youtubeAccount,
          ),
          const SizedBox(height: 16),
          _buildSnsCard(
            context,
            platform: 'TikTok',
            icon: Icons.music_note,
            color: const Color(0xFF000000),
            account: tiktokAccount,
          ),
        ],
      ),
    );
  }

  Widget _buildSnsCard(
    BuildContext context, {
    required String platform,
    required IconData icon,
    required Color color,
    required SnsAccount? account,
  }) {
    final isConnected = account != null;

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: color.withOpacity(0.1),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(
                    icon,
                    color: color,
                    size: 32,
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        platform,
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        isConnected
                            ? '${account.accountName} 연동됨'
                            : '연동 안됨',
                        style: TextStyle(
                          fontSize: 14,
                          color: isConnected ? Colors.green : Colors.grey[600],
                        ),
                      ),
                    ],
                  ),
                ),
                ElevatedButton(
                  onPressed: _isLoading
                      ? null
                      : () {
                          if (isConnected) {
                            _disconnectAccount(platform, account.id);
                          } else {
                            _showConnectDialog(context, platform, color);
                          }
                        },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: isConnected ? Colors.grey : color,
                  ),
                  child: Text(isConnected ? '연동 해제' : '연동하기'),
                ),
              ],
            ),
            if (isConnected) ...[
              const SizedBox(height: 16),
              const Divider(),
              const SizedBox(height: 16),
              _buildAccountStats(account),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildAccountStats(SnsAccount account) {
    return Column(
      children: [
        Row(
          children: [
            Expanded(
              child: _buildStatItem(
                '팔로워',
                _formatNumber(account.followers),
                Icons.people,
              ),
            ),
            Expanded(
              child: _buildStatItem(
                '참여율',
                '${account.engagementRate}%',
                Icons.trending_up,
              ),
            ),
            Expanded(
              child: _buildStatItem(
                '평균 좋아요',
                _formatNumber(account.avgLikes),
                Icons.favorite,
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        Row(
          children: [
            Expanded(
              child: _buildStatItem(
                '평균 댓글',
                _formatNumber(account.avgComments),
                Icons.comment,
              ),
            ),
            Expanded(
              child: _buildStatItem(
                '평균 조회수',
                _formatNumber(account.avgViews),
                Icons.visibility,
              ),
            ),
            Expanded(
              child: _buildStatItem(
                '연동일',
                '${account.connectedAt.month}/${account.connectedAt.day}',
                Icons.calendar_today,
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildStatItem(String label, String value, IconData icon) {
    return Column(
      children: [
        Icon(icon, size: 20, color: Colors.grey[600]),
        const SizedBox(height: 4),
        Text(
          value,
          style: const TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.bold,
          ),
        ),
        Text(
          label,
          style: TextStyle(
            fontSize: 12,
            color: Colors.grey[600],
          ),
        ),
      ],
    );
  }

  String _formatNumber(int number) {
    if (number >= 1000000) {
      return '${(number / 1000000).toStringAsFixed(1)}M';
    } else if (number >= 1000) {
      return '${(number / 1000).toStringAsFixed(1)}K';
    }
    return number.toString();
  }

  void _showConnectDialog(BuildContext context, String platform, Color color) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Row(
          children: [
            Icon(Icons.camera_alt, color: color),
            const SizedBox(width: 8),
            Text('$platform 연동'),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              '$platform 계정 연동을 시작합니다.',
              style: const TextStyle(fontSize: 14),
            ),
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.blue.shade50,
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: Colors.blue.shade200),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Icon(Icons.info_outline,
                          size: 16, color: Colors.blue.shade700),
                      const SizedBox(width: 6),
                      Text(
                        '연동 방법',
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                          color: Colors.blue.shade700,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    '1. Instagram 로그인 페이지로 이동\n2. 계정 인증 및 권한 승인\n3. 자동으로 통계 수집 시작',
                    style: TextStyle(fontSize: 11),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.amber.shade50,
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: Colors.amber.shade200),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Icon(Icons.warning_amber,
                          size: 16, color: Colors.amber.shade700),
                      const SizedBox(width: 6),
                      Text(
                        '필요 사항',
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                          color: Colors.amber.shade700,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    '• Instagram Business 또는 Creator 계정\n• Facebook 페이지에 연결된 계정',
                    style: TextStyle(fontSize: 11),
                  ),
                ],
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('취소'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              _startOAuthFlow(platform);
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: color,
            ),
            child: const Text('Instagram 연동 시작'),
          ),
        ],
      ),
    );
  }

  Future<void> _startOAuthFlow(String platform) async {
    if (platform != 'Instagram') {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('아직 지원하지 않는 플랫폼입니다'),
          backgroundColor: Colors.orange,
        ),
      );
      return;
    }

    try {
      final userId = await StorageService.getUserId();
      if (userId == null) {
        throw '로그인이 필요합니다';
      }

      // Backend OAuth URL로 이동
      final backendUrl = 'http://localhost:3000'; // TODO: API_CONSTANTS에서 가져오기
      final authUrl = '$backendUrl/sns/instagram/auth?userId=$userId';

      // 웹 브라우저로 OAuth URL 열기
      if (await canLaunchUrl(Uri.parse(authUrl))) {
        await launchUrl(Uri.parse(authUrl), mode: LaunchMode.externalApplication);
        
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Instagram 인증 페이지로 이동합니다...'),
              backgroundColor: Colors.blue,
              duration: Duration(seconds: 3),
            ),
          );
        }
      } else {
        throw 'URL을 열 수 없습니다';
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('OAuth 시작 실패: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  Future<void> _connectAccount(String platform, String accountId) async {
    setState(() => _isLoading = true);

    try {
      final repo = ref.read(snsRepositoryProvider);
      await repo.connectSns(platform: platform, accountId: accountId);

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('$platform 연동이 완료되었습니다! 🎉'),
            backgroundColor: Colors.green,
          ),
        );
        // 데이터 새로고침
        ref.invalidate(snsAccountsProvider);
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('연동 실패: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  Future<void> _disconnectAccount(String platform, String accountId) async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('연동 해제'),
        content: Text('$platform 계정 연동을 해제하시겠습니까?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('취소'),
          ),
          ElevatedButton(
            onPressed: () => Navigator.pop(context, true),
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.red,
            ),
            child: const Text('해제'),
          ),
        ],
      ),
    );

    if (confirm != true) return;

    setState(() => _isLoading = true);

    try {
      final repo = ref.read(snsRepositoryProvider);
      await repo.disconnectAccount(accountId);

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('$platform 연동이 해제되었습니다'),
            backgroundColor: Colors.orange,
          ),
        );
        // 데이터 새로고침
        ref.invalidate(snsAccountsProvider);
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('연동 해제 실패: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }
}



