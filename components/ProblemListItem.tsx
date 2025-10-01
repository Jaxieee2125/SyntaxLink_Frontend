import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { Problem } from '@/types/problem';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';

interface ProblemListItemProps {
  item: Problem;
  onPress: () => void;
}

const difficultyColors = {
  Easy: '#22C55E',   // Green
  Medium: '#F59E0B', // Amber
  Hard: '#EF4444',   // Red
};

export default function ProblemListItem({ item, onPress }: ProblemListItemProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const itemBackgroundColor = colorScheme === 'light' ? '#FFFFFF' : '#1C1C1E';
  
  return (
    <TouchableOpacity onPress={onPress} style={[styles.container, { backgroundColor: theme.surface }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.text }]}>{item.title}</Text>
        <View style={[styles.tag, { backgroundColor: difficultyColors[item.difficulty] }]}>
          <Text style={styles.tagText}>{item.difficulty}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color={theme.icon} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    // Thêm hiệu ứng đổ bóng nhẹ
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  tag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});