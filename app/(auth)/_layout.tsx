import { Stack } from 'expo-router';
import React from 'react';
import { useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';

export default function AuthLayout() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.background,
        },
        headerTintColor: theme.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerShadowVisible: false, // Bỏ đường viền dưới header
      }}
    >
      <Stack.Screen name="login" options={{ title: 'Đăng Nhập' }} />
      <Stack.Screen name="register" options={{ title: 'Tạo Tài Khoản' }} />
    </Stack>
  );
}