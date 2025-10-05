import React, { useState, useEffect, useMemo } from 'react';
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
  const headerHeight = useHeaderHeight();

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
          <ScreenHeader subtitle="Sẵn sàng cho thử thách?" title="Khám phá Cuộc thi" />

          <FilterChips
            options={['All', 'Upcoming', 'Running', 'Finished']}
            selected={filter}
            onSelect={setFilter}
            renderLabel={renderContestFilterLabel}
            containerStyle={{ marginTop: 8, marginBottom: 8 }}
          />

          {isLoading && !allContests.length ? (
            <View style={{ paddingTop: 8 }}>
              {[...Array(5)].map((_, index) => <SkeletonListItem key={index} />)}
            </View>
          ) : error ? (
            <View style={styles.centered}><Text style={{ color: Colors.danger }}>Lỗi: {error}</Text></View>
          ) : (
            <FlatList
              data={filteredContests}
              renderItem={({ item }) => <ContestListItem item={item} />}
              keyExtractor={(item) => item._id}
              ListEmptyComponent={
                <View style={styles.centeredEmpty}>
                  <Text style={{ color: theme.textMuted }}>Không có cuộc thi nào phù hợp.</Text>
                </View>
              }
              refreshControl={
                <RefreshControl refreshing={isLoading} onRefresh={onRefresh} tintColor={theme.text} />
              }
              contentContainerStyle={styles.listContainer}
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
