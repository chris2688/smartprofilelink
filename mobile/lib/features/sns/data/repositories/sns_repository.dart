import 'dart:convert';
import '../../../../core/services/storage_service.dart';
import '../models/sns_account.dart';

class SnsRepository {
  static const String _storageKey = 'sns_accounts';

  // 🔧 샘플 모드 (false로 설정하면 실제 API 사용)
  final bool useMockData = false;

  // 샘플 인스타그램 계정 데이터
  final Map<String, Map<String, dynamic>> mockInstagramAccounts = {
    'influencer_official': {
      'accountName': '@influencer_official',
      'profileImage': '👤',
      'followers': 125000,
      'engagementRate': 4.8,
      'avgLikes': 6000,
      'avgComments': 320,
      'avgViews': 85000,
    },
    'beauty_lover_kr': {
      'accountName': '@beauty_lover_kr',
      'profileImage': '💄',
      'followers': 89000,
      'engagementRate': 5.2,
      'avgLikes': 4600,
      'avgComments': 280,
      'avgViews': 62000,
    },
    'fashion_daily': {
      'accountName': '@fashion_daily',
      'profileImage': '👗',
      'followers': 256000,
      'engagementRate': 3.9,
      'avgLikes': 9980,
      'avgComments': 450,
      'avgViews': 142000,
    },
  };

  // SNS 계정 연동
  Future<SnsAccount> connectSns({
    required String platform,
    required String accountId,
  }) async {
    if (useMockData) {
      await Future.delayed(const Duration(seconds: 2)); // 로딩 시뮬레이션

      if (platform == 'Instagram') {
        if (!mockInstagramAccounts.containsKey(accountId)) {
          throw '존재하지 않는 계정입니다.\n\n샘플 계정:\n- influencer_official\n- beauty_lover_kr\n- fashion_daily';
        }

        final mockData = mockInstagramAccounts[accountId]!;
        final account = SnsAccount(
          id: 'sns_${DateTime.now().millisecondsSinceEpoch}',
          platform: platform,
          accountName: mockData['accountName'],
          profileImage: mockData['profileImage'],
          followers: mockData['followers'],
          engagementRate: mockData['engagementRate'],
          avgLikes: mockData['avgLikes'],
          avgComments: mockData['avgComments'],
          avgViews: mockData['avgViews'],
          connectedAt: DateTime.now(),
        );

        // 로컬 저장
        await _saveAccount(account);
        return account;
      }

      throw '아직 지원하지 않는 플랫폼입니다';
    }

    // 실제 API 호출 (추후 구현)
    throw UnimplementedError();
  }

  // 연동된 계정 목록 조회
  Future<List<SnsAccount>> getConnectedAccounts() async {
    final json = await StorageService.getString(_storageKey);
    if (json == null || json.isEmpty) return [];

    final List<dynamic> list = jsonDecode(json);
    return list.map((e) => SnsAccount.fromJson(e)).toList();
  }

  // 특정 플랫폼 계정 조회
  Future<SnsAccount?> getAccountByPlatform(String platform) async {
    final accounts = await getConnectedAccounts();
    try {
      return accounts.firstWhere((a) => a.platform == platform);
    } catch (e) {
      return null;
    }
  }

  // 계정 연동 해제
  Future<void> disconnectAccount(String accountId) async {
    final accounts = await getConnectedAccounts();
    accounts.removeWhere((a) => a.id == accountId);
    await _saveAllAccounts(accounts);
  }

  // 특정 플랫폼 연동 해제
  Future<void> disconnectPlatform(String platform) async {
    final accounts = await getConnectedAccounts();
    accounts.removeWhere((a) => a.platform == platform);
    await _saveAllAccounts(accounts);
  }

  // 계정 저장 (단일)
  Future<void> _saveAccount(SnsAccount account) async {
    final accounts = await getConnectedAccounts();
    // 같은 플랫폼이 있으면 제거
    accounts.removeWhere((a) => a.platform == account.platform);
    accounts.add(account);
    await _saveAllAccounts(accounts);
  }

  // 계정 전체 저장
  Future<void> _saveAllAccounts(List<SnsAccount> accounts) async {
    final json = jsonEncode(accounts.map((e) => e.toJson()).toList());
    await StorageService.saveString(_storageKey, json);
  }
}

