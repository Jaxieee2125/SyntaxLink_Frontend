import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { JobPosting } from '@/types/job';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

interface JobListItemProps {
  item: JobPosting;
}

export default function JobListItem({ item }: JobListItemProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const cardBorderColor = colorScheme === 'light' ? '#E5E7EB' : '#374151';

  return (
    <TouchableOpacity 
      onPress={() => 
        router.push({
          pathname: '/job/[id]',    // <-- Đường dẫn TĨNH
          params: { id: item._id }, // <-- Tham số ĐỘNG
        })
      }
      style={[styles.container, { backgroundColor: theme.surface, borderColor: cardBorderColor }]}
    >
      <View style={styles.iconContainer}>
        <Ionicons name="briefcase-outline" size={24} color={Colors.primary} />
      </View>
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.text }]}>{item.title}</Text>
        <Text style={[styles.company, { color: theme.textMuted }]}>{item.creator.name}</Text>
        <View style={styles.detailsContainer}>
            <Ionicons name="location-outline" size={14} color={theme.icon} />
            <Text style={[styles.detailText, { color: theme.textMuted }]}>{item.location}</Text>
            <Text style={[styles.detailText, { color: theme.textMuted, marginHorizontal: 4 }]}>•</Text>
            <Ionicons name="cash-outline" size={14} color={theme.icon} />
            <Text style={[styles.detailText, { color: theme.textMuted }]}>{item.salaryRange}</Text>
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
    borderWidth: 1,
  },
  iconContainer: {
      padding: 12,
      borderRadius: 12,
      backgroundColor: Colors.primaryLight + '20',
      marginRight: 16,
  },
  content: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  company: {
    fontSize: 14,
    fontWeight: '500',
  },
  detailsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      marginTop: 6,
  },
  detailText: {
      fontSize: 13,
  }
});