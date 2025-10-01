import React, { useState, useEffect, useMemo } from 'react';
import { View, FlatList, ActivityIndicator, Text, StyleSheet, RefreshControl, useColorScheme, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { Problem } from '@/types/problem';
import { getAllProblems } from '@/api/problems';
import ProblemListItem from '@/components/ProblemListItem';
import Colors from '@/constants/Colors';
import ScreenHeader from '@/components/ScreenHeader';
import FilterChips from '@/components/FilterChips';
import SearchBar from '@/components/SearchBar';
import { useAuth } from '@/context/AuthContext';
import { getGreeting } from '@/utils/time';
import SkeletonListItem from '@/components/SkeletonListItem'; // Import component mới

type DifficultyFilter = 'All' | 'Easy' | 'Medium' | 'Hard';

export default function ProblemListScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const { user } = useAuth();

  const [allProblems, setAllProblems] = useState<Problem[]>([]);
  const [filter, setFilter] = useState<DifficultyFilter>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProblems = async () => {
    try {
      setError(null);
      setIsLoading(true);
      const data = await getAllProblems();
      setAllProblems(data);
    } catch (err: any) {
      setError(err.error || 'Không thể tải danh sách bài tập.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  const filteredProblems = useMemo(() => {
    let problems = allProblems;
    if (filter !== 'All') {
      problems = problems.filter(p => p.difficulty === filter);
    }
    if (searchQuery.trim() !== '') {
      const lowercasedQuery = searchQuery.toLowerCase();
      problems = problems.filter(p =>
        p.title.toLowerCase().includes(lowercasedQuery)
      );
    }
    return problems;
  }, [filter, allProblems, searchQuery]);

  const onRefresh = () => fetchProblems();

  const renderDifficultyLabel = (option: DifficultyFilter) => {
    switch (option) {
      case 'All': return 'Tất cả';
      default: return option;
    }
  };

  const ListHeader = () => (
    <>
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Tìm kiếm theo tên bài tập..."
      />
      <FilterChips
        options={['All', 'Easy', 'Medium', 'Hard']}
        selected={filter}
        onSelect={setFilter}
        renderLabel={renderDifficultyLabel}
      />
    </>
  );

  // Component hiển thị khi đang tải dữ liệu lần đầu
  const LoadingScreen = () => (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ScreenHeader 
        subtitle={`${getGreeting()}, ${user?.name || 'Developer'}!`} 
        title="Thử thách hôm nay" 
      />
      <ListHeader />
      <View style={{ paddingTop: 8 }}>
        {[...Array(5)].map((_, index) => <SkeletonListItem key={index} />)}
      </View>
    </SafeAreaView>
  );

  if (isLoading && !allProblems.length) {
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
      <ScreenHeader 
        subtitle={`${getGreeting()}, ${user?.name || 'Developer'}!`} 
        title="Thử thách hôm nay" 
      />
      <FlatList
        data={filteredProblems}
        renderItem={({ item }) => (
          <ProblemListItem 
            item={item} 
            onPress={() => 
              router.push({
                pathname: '/problem/[id]', // <-- Đường dẫn TĨNH
                params: { id: item._id },   // <-- Tham số ĐỘNG
              })}
          />
        )}
        keyExtractor={(item) => item._id}
        ListHeaderComponent={<ListHeader />}
        ListEmptyComponent={
          <View style={styles.centeredEmpty}>
            <Text style={{ color: theme.textMuted }}>Không có bài tập nào phù hợp.</Text>
          </View>
        }
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={onRefresh} tintColor={Colors.primary} />
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