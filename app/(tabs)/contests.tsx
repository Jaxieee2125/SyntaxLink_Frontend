import React, { useState, useEffect, useMemo } from 'react';
import { View, FlatList, ActivityIndicator, Text, StyleSheet, RefreshControl, useColorScheme, SafeAreaView } from 'react-native';
import { Contest, ContestStatus } from '@/types/contest';
import { getAllContests } from '@/api/contests';
import ContestListItem from '@/components/ContestListItem';
import Colors from '@/constants/Colors';
import ScreenHeader from '@/components/ScreenHeader';
import FilterChips from '@/components/FilterChips';
import SkeletonListItem from '@/components/SkeletonListItem';

type ContestFilter = 'All' | 'Upcoming' | 'Running' | 'Finished';

const getContestStatus = (startTime: string, endTime: string): ContestStatus => {
  const now = new Date();
  if (now < new Date(startTime)) return 'Upcoming';
  if (now > new Date(endTime)) return 'Finished';
  return 'Running';
};

export default function ContestListScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  const [allContests, setAllContests] = useState<Contest[]>([]);
  const [filter, setFilter] = useState<ContestFilter>('All');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContests = async () => {
    try {
      setError(null);
      setIsLoading(true);
      const data = await getAllContests();
      setAllContests(data);
    } catch (err: any) {
      setError(err.error || 'Không thể tải danh sách cuộc thi.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContests();
  }, []);

  const filteredContests = useMemo(() => {
    if (filter === 'All') return allContests;
    return allContests.filter(c => getContestStatus(c.startTime, c.endTime) === filter);
  }, [filter, allContests]);

  const onRefresh = () => fetchContests();

  const renderContestFilterLabel = (option: ContestFilter) => {
    switch (option) {
      case 'All': return 'Tất cả';
      case 'Upcoming': return 'Sắp diễn ra';
      case 'Running': return 'Đang diễn ra';
      case 'Finished': return 'Đã kết thúc';
      default: return option;
    }
  };

  const ListHeader = () => (
    <FilterChips
      options={['All', 'Upcoming', 'Running', 'Finished']}
      selected={filter}
      onSelect={setFilter}
      renderLabel={renderContestFilterLabel}
    />
  );
  
  const LoadingScreen = () => (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
        <ScreenHeader subtitle="Sẵn sàng cho thử thách?" title="Khám phá Cuộc thi" />
        <ListHeader />
        <View style={{ paddingTop: 8 }}>
            {[...Array(5)].map((_, index) => <SkeletonListItem key={index} />)}
        </View>
    </SafeAreaView>
  );

  if (isLoading && !allContests.length) {
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
      <ScreenHeader subtitle="Sẵn sàng cho thử thách?" title="Khám phá Cuộc thi" />
      <FlatList
        data={filteredContests}
        renderItem={({ item }) => <ContestListItem item={item} />}
        keyExtractor={(item) => item._id}
        ListHeaderComponent={<ListHeader />}
        ListEmptyComponent={
          <View style={styles.centeredEmpty}>
            <Text style={{ color: theme.textMuted }}>Không có cuộc thi nào phù hợp.</Text>
          </View>
        }
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={onRefresh} tintColor={Colors.primary} />
        }
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center' },
  centeredEmpty: { padding: 40, alignItems: 'center' },
  listContainer: { paddingBottom: 20 },
});