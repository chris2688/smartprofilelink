import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/services/api_service.dart';
import '../../../../core/services/storage_service.dart';
import '../../../../core/constants/api_constants.dart';

class AuthRepository {
  final ApiService _apiService;

  AuthRepository(this._apiService);

  // 🔧 샘플 로그인 활성화 (DB 없이 테스트용)
  final bool useMockLogin = true;

  // 샘플 계정 정보
  final Map<String, String> mockUsers = {
    'test@example.com': 'password123',
    'demo@example.com': 'demo123',
    'admin@example.com': 'admin123',
  };

  Future<void> signup({
    required String name,
    required String username,
    required String email,
    required String password,
  }) async {
    if (useMockLogin) {
      // 샘플 회원가입 (자동 성공)
      await Future.delayed(const Duration(seconds: 1)); // 로딩 시뮬레이션
      
      await StorageService.saveAccessToken('mock_access_token_${DateTime.now().millisecondsSinceEpoch}');
      await StorageService.saveRefreshToken('mock_refresh_token_${DateTime.now().millisecondsSinceEpoch}');
      await StorageService.saveUserId('mock_user_id_${username}');
      await StorageService.saveString('user_name', name);
      await StorageService.saveString('user_email', email);
      await StorageService.saveString('user_username', username);
      return;
    }

    try {
      final response = await _apiService.dio.post(
        ApiConstants.signup,
        data: {
          'name': name,
          'username': username,
          'email': email,
          'password': password,
        },
      );

      final data = response.data;
      await StorageService.saveAccessToken(data['accessToken']);
      await StorageService.saveRefreshToken(data['refreshToken']);
      await StorageService.saveUserId(data['user']['id']);
    } on DioException catch (e) {
      throw e.response?.data['message'] ?? '회원가입에 실패했습니다';
    }
  }

  Future<void> login(String email, String password) async {
    if (useMockLogin) {
      // 샘플 로그인 검증
      await Future.delayed(const Duration(seconds: 1)); // 로딩 시뮬레이션
      
      if (mockUsers.containsKey(email) && mockUsers[email] == password) {
        // 로그인 성공
        await StorageService.saveAccessToken('mock_access_token_${DateTime.now().millisecondsSinceEpoch}');
        await StorageService.saveRefreshToken('mock_refresh_token_${DateTime.now().millisecondsSinceEpoch}');
        await StorageService.saveUserId('mock_user_id_${email.split('@')[0]}');
        await StorageService.saveString('user_name', email.split('@')[0].toUpperCase());
        await StorageService.saveString('user_email', email);
        await StorageService.saveString('user_username', email.split('@')[0]);
        return;
      } else {
        // 로그인 실패
        throw '이메일 또는 비밀번호가 올바르지 않습니다.\n\n샘플 계정:\n- test@example.com / password123\n- demo@example.com / demo123\n- admin@example.com / admin123';
      }
    }

    try {
      final response = await _apiService.dio.post(
        ApiConstants.login,
        data: {
          'email': email,
          'password': password,
        },
      );

      final data = response.data;
      await StorageService.saveAccessToken(data['accessToken']);
      await StorageService.saveRefreshToken(data['refreshToken']);
      await StorageService.saveUserId(data['user']['id']);
    } on DioException catch (e) {
      throw e.response?.data['message'] ?? '로그인에 실패했습니다';
    }
  }

  Future<void> logout() async {
    try {
      await _apiService.dio.post(ApiConstants.logout);
    } catch (e) {
      // Ignore error
    } finally {
      await StorageService.clearAll();
    }
  }

  Future<Map<String, dynamic>> getMe() async {
    try {
      final response = await _apiService.dio.get(ApiConstants.me);
      return response.data;
    } on DioException catch (e) {
      throw e.response?.data['message'] ?? '사용자 정보를 가져올 수 없습니다';
    }
  }
}

final authRepositoryProvider = Provider<AuthRepository>((ref) {
  final apiService = ref.watch(apiServiceProvider);
  return AuthRepository(apiService);
});



