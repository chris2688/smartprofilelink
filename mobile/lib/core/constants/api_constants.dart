class ApiConstants {
  // API Base URL - 실제 서버 주소로 변경 필요
  static const String baseUrl = 'http://localhost:3000';
  
  // Auth Endpoints
  static const String signup = '/auth/signup';
  static const String login = '/auth/login';
  static const String refresh = '/auth/refresh';
  static const String logout = '/auth/logout';
  static const String me = '/auth/me';
  
  // User Endpoints
  static const String userMe = '/user/me';
  
  // SNS Endpoints
  static const String snsConnect = '/sns/connect';
  static const String snsStats = '/sns/stats';
  static const String snsPortfolio = '/sns/portfolio';
  static const String snsRefresh = '/sns/refresh';
  
  // Price Endpoints
  static const String priceCalc = '/price/calc';
  static const String priceCalcAll = '/price/calc-all';
  
  // Proposal Endpoints
  static const String proposal = '/proposal';
  
  // Brand Endpoints
  static const String brandRequests = '/brand/requests';
  static const String brandRequest = '/brand/request';
  
  // Profile Endpoints
  static const String profile = '/profile';
}



