import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

class SnsConnectScreen extends ConsumerWidget {
  const SnsConnectScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('SNS 연동'),
      ),
      body: SingleChildScrollView(
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
              isConnected: false,
            ),
            const SizedBox(height: 16),
            _buildSnsCard(
              context,
              platform: 'YouTube',
              icon: Icons.play_circle_filled,
              color: const Color(0xFFFF0000),
              isConnected: false,
            ),
            const SizedBox(height: 16),
            _buildSnsCard(
              context,
              platform: 'TikTok',
              icon: Icons.music_note,
              color: const Color(0xFF000000),
              isConnected: false,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSnsCard(
    BuildContext context, {
    required String platform,
    required IconData icon,
    required Color color,
    required bool isConnected,
  }) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Row(
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
                    isConnected ? '연동됨' : '연동 안됨',
                    style: TextStyle(
                      fontSize: 14,
                      color: isConnected ? Colors.green : Colors.grey[600],
                    ),
                  ),
                ],
              ),
            ),
            ElevatedButton(
              onPressed: () {
                _showConnectDialog(context, platform);
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: isConnected ? Colors.grey : color,
              ),
              child: Text(isConnected ? '연동 해제' : '연동하기'),
            ),
          ],
        ),
      ),
    );
  }

  void _showConnectDialog(BuildContext context, String platform) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('$platform 연동'),
        content: Text(
          '$platform OAuth 인증을 진행합니다.\n\n'
          '실제 구현 시 OAuth 플로우가 필요합니다.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('취소'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text('$platform 연동이 완료되었습니다'),
                  backgroundColor: Colors.green,
                ),
              );
            },
            child: const Text('연동'),
          ),
        ],
      ),
    );
  }
}



