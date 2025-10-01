import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { Submission, SubmissionStatus } from '@/types/submission';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';

interface SubmissionListItemProps {
  item: Submission;
}

const getStatusStyle = (status: SubmissionStatus) => {
  switch (status) {
    case 'Accepted':
      return { backgroundColor: '#10B981', color: '#FFFFFF' }; // Green
    case 'Wrong Answer':
    case 'Time Limit Exceeded':
    case 'Runtime Error':
    case 'Compilation Error':
      return { backgroundColor: '#EF4444', color: '#FFFFFF' }; // Red
    default:
      return { backgroundColor: '#6B7280', color: '#FFFFFF' }; // Gray
  }
};

export default function SubmissionListItem({ item }: SubmissionListItemProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const itemBackgroundColor = colorScheme === 'light' ? '#FFFFFF' : '#1C1C1E';
  const statusStyle = getStatusStyle(item.status);

  return (
    <View style={[styles.container, { backgroundColor: itemBackgroundColor }]}>
      <View style={styles.leftContent}>
        <View style={[styles.statusTag, { backgroundColor: statusStyle.backgroundColor }]}>
          <Text style={[styles.statusText, { color: statusStyle.color }]}>{item.status}</Text>
        </View>
        <Text style={[styles.languageText, { color: theme.text }]}>
          Ngôn ngữ: {item.language.toUpperCase()}
        </Text>
      </View>
      <View style={styles.rightContent}>
        <Text style={[styles.dateText, { color: theme.icon }]}>
          {new Date(item.createdAt).toLocaleString('vi-VN')}
        </Text>
        <Ionicons name="chevron-forward" size={20} color={theme.icon} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  leftContent: {
    gap: 8,
  },
  rightContent: {
    alignItems: 'flex-end',
    gap: 8,
  },
  statusTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  languageText: {
    fontSize: 14,
  },
  dateText: {
    fontSize: 12,
  },
});