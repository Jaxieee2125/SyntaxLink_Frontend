import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';

interface ScreenHeaderProps {
  title: string;
  subtitle: string;
}

export default function ScreenHeader({ title, subtitle }: ScreenHeaderProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  return (
    <View style={[styles.container, { borderBottomColor: theme.surface }]}>
      <Text style={[styles.subtitle, { color: theme.textMuted }]}>{subtitle}</Text>
      <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 20, // Tăng padding top để header "thở" hơn
    paddingBottom: 16, // Tăng padding bottom
    borderBottomWidth: 1, // Thêm đường viền
  },
  subtitle: {
    fontSize: 16,
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
});