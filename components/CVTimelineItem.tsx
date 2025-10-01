import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';

interface CVTimelineItemProps {
  title: string;
  subtitle: string;
  dateRange: string;
  description?: string;
}

export default function CVTimelineItem({ title, subtitle, dateRange, description }: CVTimelineItemProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
        <Text style={[styles.date, { color: theme.textMuted }]}>{dateRange}</Text>
      </View>
      <Text style={[styles.subtitle, { color: theme.tint }]}>{subtitle}</Text>
      {description && <Text style={[styles.description, { color: theme.textMuted }]}>{description}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
  },
});