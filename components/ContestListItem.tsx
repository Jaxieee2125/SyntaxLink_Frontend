import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { Contest, ContestStatus } from '@/types/contest';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router'; // Đảm bảo đã import router

// Bỏ prop `onPress` vì component này sẽ tự xử lý việc điều hướng.
interface ContestListItemProps {
  item: Contest;
}

// Helper function để xác định trạng thái và màu sắc
const getContestStatus = (startTime: string, endTime: string): { status: ContestStatus; color: string } => {
  const now = new Date();
  const start = new Date(startTime);
  const end = new Date(endTime);

  if (now < start) {
    return { status: 'Upcoming', color: '#3B82F6' }; // Blue
  } else if (now >= start && now <= end) {
    return { status: 'Running', color: '#10B981' }; // Green
  } else {
    return { status: 'Finished', color: '#6B7280' }; // Gray
  }
};

export default function ContestListItem({ item }: ContestListItemProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const itemBackgroundColor = colorScheme === 'light' ? '#FFFFFF' : '#1C1C1E';
  const { status, color } = getContestStatus(item.startTime, item.endTime);

  return (
    // ==========================================================
    // ĐÂY LÀ PHẦN QUAN TRỌNG NHẤT ĐÃ ĐƯỢC SỬA
    // ==========================================================
    <TouchableOpacity 
      onPress={() => 
        router.push({
          pathname: '/contest/[id]', // <-- Đường dẫn TĨNH, an toàn với TypeScript
          params: { id: item._id },   // <-- Tham số ĐỘNG
        })
      } 
      style={[styles.container, { backgroundColor: itemBackgroundColor }]}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>{item.title}</Text>
          <View style={[styles.tag, { backgroundColor: color }]}>
            <Text style={styles.tagText}>{status}</Text>
          </View>
        </View>
        <Text style={[styles.time, { color: theme.icon }]}>
          Bắt đầu: {new Date(item.startTime).toLocaleString('vi-VN')}
        </Text>
        <Text style={[styles.time, { color: theme.icon }]}>
          Kết thúc: {new Date(item.endTime).toLocaleString('vi-VN')}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={theme.icon} />
    </TouchableOpacity>
  );
}

// Các style giữ nguyên
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
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
  content: {
    flex: 1,
    gap: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  time: {
    fontSize: 13,
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