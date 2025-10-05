import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, useColorScheme, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router, useNavigation } from 'expo-router';
import { Problem } from '@/types/problem';
import { getProblemById } from '@/api/problems';
import Colors from '@/constants/Colors';
import StyledButton from '@/components/StyledButton';
import { Ionicons } from '@expo/vector-icons';

export default function ProblemDetailScreen() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const { id, contestId } = useLocalSearchParams<{ id: string, contestId?: string }>();

  // Các state giữ nguyên
  const [problem, setProblem] = useState<Problem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchProblemAndUpdateHeader = async () => {
      try {
        const data = await getProblemById(id);
        setProblem(data);

        // Cập nhật header NGAY SAU KHI có dữ liệu
        navigation.setOptions({
          title: data.title, // Đặt tiêu đề động
          headerRight: () => ( // Thêm component vào bên phải header
            <TouchableOpacity
              onPress={() => router.push({
                pathname: '/submissionHistory',
                params: { problemId: id, problemTitle: data.title }
              })}
              style={{ marginRight: 15 }}
            >
              <Ionicons name="timer-outline" size={24} color={theme.text} />
            </TouchableOpacity>
          ),
        });

      } catch (err: any) {
        setError(err.error || 'Không thể tải chi tiết bài tập.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProblemAndUpdateHeader();
    
    // Thêm navigation và theme vào dependency array để tuân thủ quy tắc của hooks
    // Điều này đảm bảo header sẽ được render lại đúng nếu theme thay đổi
  }, [id, navigation, theme]);

  // Phần còn lại của component giữ nguyên
  if (isLoading) {
    return <View style={styles.centered}><ActivityIndicator size="large" /></View>;
  }

  if (error || !problem) {
    return <View style={styles.centered}><Text style={{ color: 'red' }}>Lỗi: {error || 'Không tìm thấy bài toán.'}</Text></View>;
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>{problem.title}</Text>
        <View style={styles.tagsContainer}>
          <Text style={styles.tag}>Time Limit: {problem.timeLimit}s</Text>
          <Text style={styles.tag}>Memory Limit: {problem.memoryLimit}MB</Text>
        </View>
      </View>
      <View style={styles.content}>
        <Text style={[styles.description, { color: theme.text }]}>{problem.description}</Text>
      </View>
      <View style={styles.buttonContainer}>
          <StyledButton 
              title="Bắt đầu giải" 
              onPress={() => 
                  router.push({
                      pathname: '/solve',
                      params: { 
                          problemId: problem._id, 
                          problemTitle: problem.title,
                          contestId: contestId // <-- TRUYỀN CONTEST ID TIẾP
                      }
                  })
              } 
          />
        </View>
    </ScrollView>
  );
}

// Styles giữ nguyên
const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { flex: 1 },
  header: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#e5e5e5' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  tagsContainer: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  tag: { backgroundColor: '#eee', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, fontSize: 12, color: '#555' },
  content: { padding: 20 },
  description: { fontSize: 16, lineHeight: 24 },
  buttonContainer: { padding: 20, marginTop: 20 },
});