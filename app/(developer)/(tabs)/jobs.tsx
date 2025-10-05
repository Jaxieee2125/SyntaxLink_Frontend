import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  RefreshControl,
  useColorScheme,
  SafeAreaView,
} from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';
import { LinearGradient } from 'expo-linear-gradient';

import { JobPosting } from '@/types/job';
import { getAllJobs } from '@/api/jobs';
import JobListItem from '@/components/JobListItem';
import Colors from '@/constants/Colors';
import ScreenHeader from '@/components/ScreenHeader';
import SearchBar from '@/components/SearchBar';
import SkeletonListItem from '@/components/SkeletonListItem';

export default function JobListScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const headerHeight = useHeaderHeight();

  const [allJobs, setAllJobs] = useState<JobPosting[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = useCallback(async (query: string) => {
    try {
      setError(null);
      if (!isRefreshing) setIsLoading(true);
      const data = await getAllJobs({ search: query });
      setAllJobs(data);
    } catch (err: any) {
      setError(err.error || 'Không thể tải danh sách việc làm.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [isRefreshing]);

  useEffect(() => {
    fetchJobs('');
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchJobs(searchQuery);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const onRefresh = () => {
    setIsRefreshing(true);
    setSearchQuery('');
    fetchJobs('');
  };

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={[theme.headerGradientStart, theme.headerGradientEnd, theme.background]}
        locations={[0, 0.18, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={{ flex: 1, paddingTop: headerHeight }}>
        <View style={{ flex: 1, paddingHorizontal: 16 }}>
          <ScreenHeader title="Cơ hội việc làm" subtitle="Tìm kiếm công việc mơ ước của bạn" />

          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Tìm theo kỹ năng, chức danh..."
            inputStyle={{
              backgroundColor: theme.inputBg,
              color: theme.inputText,
              borderColor: theme.outline,
            }}
            placeholderTextColor={theme.placeholder}
            iconColor={theme.icon}
          />

          {isLoading && !allJobs.length ? (
            <View style={{ paddingTop: 8 }}>
              {[...Array(5)].map((_, index) => <SkeletonListItem key={index} />)}
            </View>
          ) : error ? (
            <View style={styles.centered}><Text style={{ color: Colors.danger }}>Lỗi: {error}</Text></View>
          ) : (
            <FlatList
              data={allJobs}
              renderItem={({ item }) => <JobListItem item={item} />}
              keyExtractor={(item) => item._id}
              ListEmptyComponent={
                <View style={styles.centeredEmpty}>
                  <Text style={{ color: theme.textMuted }}>Không tìm thấy công việc nào.</Text>
                </View>
              }
              refreshControl={
                <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor={theme.text} />
              }
              contentContainerStyle={styles.listContainer}
              keyboardDismissMode="on-drag"
            />
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center' },
  centeredEmpty: { padding: 40, alignItems: 'center' },
  listContainer: { paddingBottom: 120 },
});
