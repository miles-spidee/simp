import 'package:flutter_riverpod/flutter_riverpod.dart';

enum AppThemeMode { light, dark }

final themeProvider = Provider<AppThemeMode>((ref) => AppThemeMode.light);
