import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../features/auth/presentation/screens/onboarding_screen.dart';
import '../../features/auth/presentation/screens/login_screen.dart';
import '../../features/auth/presentation/screens/signup_screen.dart';
import '../../features/home/presentation/screens/home_screen.dart';
import '../../features/sns/presentation/screens/sns_connect_screen.dart';
import '../../features/profile/presentation/screens/profile_preview_screen.dart';
import '../../features/price/presentation/screens/price_calculator_screen.dart';
import '../../features/proposal/presentation/screens/proposal_screen.dart';
import '../../features/brand/presentation/screens/brand_requests_screen.dart';
import '../../features/settings/presentation/screens/settings_screen.dart';

final appRouterProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    initialLocation: '/onboarding',
    routes: [
      GoRoute(
        path: '/onboarding',
        builder: (context, state) => const OnboardingScreen(),
      ),
      GoRoute(
        path: '/login',
        builder: (context, state) => const LoginScreen(),
      ),
      GoRoute(
        path: '/signup',
        builder: (context, state) => const SignupScreen(),
      ),
      GoRoute(
        path: '/home',
        builder: (context, state) => const HomeScreen(),
      ),
      GoRoute(
        path: '/sns-connect',
        builder: (context, state) => const SnsConnectScreen(),
      ),
      GoRoute(
        path: '/profile-preview',
        builder: (context, state) => const ProfilePreviewScreen(),
      ),
      GoRoute(
        path: '/price-calculator',
        builder: (context, state) => const PriceCalculatorScreen(),
      ),
      GoRoute(
        path: '/proposal',
        builder: (context, state) => const ProposalScreen(),
      ),
      GoRoute(
        path: '/brand-requests',
        builder: (context, state) => const BrandRequestsScreen(),
      ),
      GoRoute(
        path: '/settings',
        builder: (context, state) => const SettingsScreen(),
      ),
    ],
  );
});



