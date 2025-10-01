import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, ActivityIndicator, Text, StyleSheet, RefreshControl, useColorScheme, SafeAreaView } from 'react-native';
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
  
  const ListHeader = () => (
    <SearchBar
      value={searchQuery}
      onChangeText={setSearchQuery}
      placeholder="Tìm theo kỹ năng, chức danh..."
    />
  );
  
  const LoadingScreen = () => (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ScreenHeader title="Cơ hội việc làm" subtitle="Tìm kiếm công việc mơ ước của bạn" />
      <ListHeader />
      <View style={{ paddingTop: 8 }}>
        {[...Array(5)].map((_, index) => <SkeletonListItem key={index} />)}
      </View>
    </SafeAreaView>
  );

  if (isLoading && !allJobs.length) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.centered, { backgroundColor: theme.background }]}>
        <Text style={{ color: Colors.danger }}>Lỗi: {error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ScreenHeader title="Cơ hội việc làm" subtitle="Tìm kiếm công việc mơ ước của bạn" />
      <FlatList
        data={allJobs}
        renderItem={({ item }) => <JobListItem item={item} />}
        keyExtractor={(item) => item._id}
        ListHeaderComponent={<ListHeader />}
        ListEmptyComponent={
          <View style={styles.centeredEmpty}>
            <Text style={{ color: theme.textMuted }}>Không tìm thấy công việc nào.</Text>
          </View>
        }
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
        }
        contentContainerStyle={styles.listContainer}
        keyboardDismissMode="on-drag"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center' },
  centeredEmpty: { padding: 40, alignItems: 'center' },
  listContainer: { paddingBottom: 20 },
});