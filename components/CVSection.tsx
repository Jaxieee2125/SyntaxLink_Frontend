import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';

interface CVSectionProps {
  title: string;
  children: React.ReactNode;
}

export default function CVSection({ title, children }: CVSectionProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
      <View style={[styles.divider, { backgroundColor: theme.tint }]} />
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  divider: {
    height: 2,
    width: 40,
    marginBottom: 12,
  },
  content: {},
});