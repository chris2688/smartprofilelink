import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class PriceCalculatorScreen extends ConsumerStatefulWidget {
  const PriceCalculatorScreen({super.key});

  @override
  ConsumerState<PriceCalculatorScreen> createState() => _PriceCalculatorScreenState();
}

class _PriceCalculatorScreenState extends ConsumerState<PriceCalculatorScreen> {
  String _selectedPlatform = 'INSTAGRAM';
  String _selectedBrandType = 'medium';

  final Map<String, String> _platforms = {
    'INSTAGRAM': 'Instagram',
    'YOUTUBE': 'YouTube',
    'TIKTOK': 'TikTok',
  };

  final Map<String, String> _brandTypes = {
    'large': '대기업 (+30%)',
    'medium': '중소기업 (+15%)',
    'small': '쇼핑몰/스타트업',
  };

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('광고 단가 계산기'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              '광고 단가 자동 계산',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              '나의 팔로워 수와 참여율을 기반으로\n정확한 광고 단가를 계산합니다',
              style: TextStyle(
                fontSize: 14,
                color: Colors.grey[600],
              ),
            ),
            const SizedBox(height: 32),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      '플랫폼 선택',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 12),
                    DropdownButtonFormField<String>(
                      value: _selectedPlatform,
                      decoration: const InputDecoration(
                        contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                      ),
                      items: _platforms.entries.map((entry) {
                        return DropdownMenuItem(
                          value: entry.key,
                          child: Text(entry.value),
                        );
                      }).toList(),
                      onChanged: (value) {
                        setState(() {
                          _selectedPlatform = value!;
                        });
                      },
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      '브랜드 등급',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 12),
                    DropdownButtonFormField<String>(
                      value: _selectedBrandType,
                      decoration: const InputDecoration(
                        contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                      ),
                      items: _brandTypes.entries.map((entry) {
                        return DropdownMenuItem(
                          value: entry.key,
                          child: Text(entry.value),
                        );
                      }).toList(),
                      onChanged: (value) {
                        setState(() {
                          _selectedBrandType = value!;
                        });
                      },
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 24),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: _calculatePrice,
                child: const Text('단가 계산하기'),
              ),
            ),
            const SizedBox(height: 32),
            _buildPriceResult(),
          ],
        ),
      ),
    );
  }

  void _calculatePrice() {
    // TODO: API 호출하여 실제 단가 계산
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('먼저 SNS를 연동해주세요'),
        backgroundColor: Colors.orange,
      ),
    );
  }

  Widget _buildPriceResult() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              '예상 광고 단가',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            _buildPriceItem('사진 포스팅', '계산 필요'),
            const Divider(),
            _buildPriceItem('릴스/쇼츠', '계산 필요'),
            const Divider(),
            _buildPriceItem('일반 영상', '계산 필요'),
            const Divider(),
            _buildPriceItem('패키지 (사진+영상)', '계산 필요'),
          ],
        ),
      ),
    );
  }

  Widget _buildPriceItem(String label, String price) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: const TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w500,
            ),
          ),
          Text(
            price,
            style: const TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: Color(0xFF6C5CE7),
            ),
          ),
        ],
      ),
    );
  }
}



