import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, useColorScheme, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { ContestDetail, ContestProblem } from '@/types/contest';
import { Problem } from '@/types/problem';
import { getContestById } from '@/api/contests';
import { getProblemById } from '@/api/problems'; // Import API mới
import Colors from '@/constants/Colors';
import StyledButton from '@/components/StyledButton';

export default function ContestArenaScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  const [contest, setContest] = useState<ContestDetail | null>(null);
  const [selectedProblem, setSelectedProblem] = useState<ContestProblem | null>(null);
  const [selectedProblemDetail, setSelectedProblemDetail] = useState<Problem | null>(null);
  
  const [isLoadingContest, setIsLoadingContest] = useState(true);
  const [isLoadingProblem, setIsLoadingProblem] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Effect để tải thông tin cuộc thi
  useEffect(() => {
    if (!id) return;
    getContestById(id)
      .then(data => {
        setContest(data);
        if (data.problems?.length > 0) {
          setSelectedProblem(data.problems[0]);
        }
      })
      .catch(err => setError(err.error || 'Lỗi tải dữ liệu phòng thi.'))
      .finally(() => setIsLoadingContest(false));
  }, [id]);

  // Effect để tải chi tiết bài toán KHI người dùng chọn
  useEffect(() => {
    if (!selectedProblem) return;
    
    setIsLoadingProblem(true);
    setSelectedProblemDetail(null); // Xóa chi tiết cũ
    
    getProblemById(selectedProblem.problemId._id)
      .then(data => {
        setSelectedProblemDetail(data);
      })
      .catch(() => setError('Không thể tải chi tiết bài tập này.'))
      .finally(() => setIsLoadingProblem(false));
  }, [selectedProblem]);

  if (isLoadingContest) {
    return <View style={styles.centered}><ActivityIndicator size="large" color={Colors.primary} /></View>;
  }

  if (error || !contest) {
    return <View style={styles.centered}><Text style={{ color: Colors.danger }}>Lỗi: {error}</Text></View>;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen options={{ title: contest.title }} />
      
      <View style={[styles.problemSelector, { borderBottomColor: theme.surface }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {contest.problems.map(p => (
            <TouchableOpacity 
              key={p.problemId._id}
              style={[
                styles.problemTab, 
                { backgroundColor: theme.surface },
                selectedProblem?.problemId._id === p.problemId._id && styles.activeTab
              ]}
              onPress={() => setSelectedProblem(p)}
            >
              <Text style={[styles.tabText, { color: theme.textMuted }, selectedProblem?.problemId._id === p.problemId._id && styles.activeTabText]}>
                Bài {p.alias}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      <ScrollView style={styles.detailContainer}>
        {isLoadingProblem && <ActivityIndicator color={Colors.primary} style={{ marginTop: 20 }}/>}
        {!isLoadingProblem && selectedProblemDetail && (
          <>
            <Text style={[styles.problemTitle, { color: theme.text }]}>
              {selectedProblemDetail.title}
            </Text>
            <Text style={[styles.problemDescription, { color: theme.text }]}>
              {selectedProblemDetail.description.replace(/\\n/g, '\n')}
            </Text>
          </>
        )}
      </ScrollView>

      <View style={[styles.buttonContainer, { backgroundColor: theme.surface, borderTopColor: theme.background }]}>
          <StyledButton 
            title={`Nộp bài ${selectedProblem?.alias || ''}`} 
            onPress={() => {
                if(selectedProblem && selectedProblemDetail) {
                    router.push({
                        pathname: '/solve',
                        params: { 
                            problemId: selectedProblemDetail._id, 
                            problemTitle: selectedProblemDetail.title,
                            contestId: contest._id
                        }
                    })
                }
            }}
            isLoading={!selectedProblemDetail}
          />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    container: { flex: 1 },
    problemSelector: {
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
    },
    problemTab: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        marginHorizontal: 4,
    },
    activeTab: {
        backgroundColor: Colors.primary,
    },
    tabText: {
        fontWeight: 'bold',
        fontSize: 15,
    },
    activeTabText: {
        color: 'white',
    },
    detailContainer: {
        flex: 1,
        padding: 20,
    },
    problemTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    problemDescription: {
        fontSize: 16,
        lineHeight: 26, // Tăng khoảng cách dòng cho dễ đọc
    },
    buttonContainer: {
        padding: 20,
        borderTopWidth: 1,
    }
});