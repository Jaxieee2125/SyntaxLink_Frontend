import React, { useState, useEffect } from 'react';
import { View, FlatList, ActivityIndicator, Text, StyleSheet, RefreshControl } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Submission } from '@/types/submission';
import { getSubmissionsByProblem } from '@/api/submissions';
import SubmissionListItem from '@/components/SubmissionListItem';

export default function SubmissionHistoryScreen() {
  const { problemId, problemTitle } = useLocalSearchParams<{ problemId: string, problemTitle: string }>();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubmissions = async () => {
    if (!problemId) return;
    try {
      setError(null);
      const data = await getSubmissionsByProblem(problemId);
      setSubmissions(data);
    } catch (err: any) {
      setError(err.error || 'Không thể tải lịch sử nộp bài.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [problemId]);

  const onRefresh = () => {
    setIsLoading(true);
    fetchSubmissions();
  };

  return (
    <>
      <Stack.Screen options={{ title: problemTitle || 'Lịch sử nộp bài' }} />
      <FlatList
        data={submissions}
        renderItem={({ item }) => <SubmissionListItem item={item} />}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text>{isLoading ? '' : 'Chưa có bài nộp nào.'}</Text>
          </View>
        }
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ flexGrow: 1 }}
      />
      {isLoading && <ActivityIndicator style={StyleSheet.absoluteFill} size="large" />}
    </>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});