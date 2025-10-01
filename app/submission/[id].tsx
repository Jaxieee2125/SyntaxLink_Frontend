import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, useColorScheme } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Submission, SubmissionStatus } from '@/types/submission';
import { getSubmissionById } from '@/api/submissions';
import Colors from '@/constants/Colors';
import CodeEditor, { CodeEditorSyntaxStyles } from '@rivascva/react-native-code-editor';

// Helper function để lấy style dựa trên trạng thái submission
const getStatusStyle = (status: SubmissionStatus) => {
  switch (status) {
    case 'Accepted':
      return { backgroundColor: '#10B981', color: '#FFFFFF' }; // Green
    case 'Wrong Answer':
    case 'Time Limit Exceeded':
    case 'Runtime Error':
    case 'Compilation Error':
      return { backgroundColor: '#EF4444', color: '#FFFFFF' }; // Red
    default:
      return { backgroundColor: '#6B7280', color: '#FFFFFF' }; // Gray (Pending, Judging)
  }
};

export default function SubmissionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  const [submission, setSubmission] = useState<Submission | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    let isMounted = true; // Cờ để kiểm tra component có còn tồn tại không
    let intervalId: NodeJS.Timeout;

    const fetchSubmission = async () => {
      try {
        const data = await getSubmissionById(id);
        // Chỉ cập nhật state nếu component vẫn còn "sống"
        if (isMounted) {
            setSubmission(data);
            // Nếu bài vẫn đang chấm, trả về true để tiếp tục polling
            if (data.status === 'Pending' || data.status === 'Judging') {
              return true;
            }
        }
        // Nếu bài đã chấm xong hoặc component đã unmount, trả về false để dừng
        return false; 
      } catch (err: any) {
        if (isMounted) {
            setError(err.error || 'Không thể tải chi tiết lượt nộp bài.');
        }
        return false; // Dừng polling khi có lỗi
      }
    };

    // Chạy lần đầu tiên ngay lập tức
    fetchSubmission();

    // Thiết lập Polling: Tự động gọi lại API sau mỗi 2 giây
    intervalId = setInterval(async () => {
      const shouldContinue = await fetchSubmission();
      if (!shouldContinue) {
        clearInterval(intervalId); // Dừng interval
      }
    }, 2000);

    // Dọn dẹp: Hàm này sẽ được gọi khi component bị unmount (rời khỏi màn hình)
    return () => {
      isMounted = false; // Đánh dấu component đã unmount
      clearInterval(intervalId); // Hủy interval để tránh memory leak
    };
  }, [id]);
  
  const statusStyle = submission ? getStatusStyle(submission.status) : { backgroundColor: '#6B7280', color: '#FFFFFF' };
  const infoBoxBg = colorScheme === 'light' ? '#F3F4F6' : '#1C1C1E';

  // Màn hình chờ ban đầu
  if (!submission && !error) {
    return <View style={styles.centered}><ActivityIndicator size="large" /></View>;
  }

  // Màn hình lỗi
  if (error) {
    return <View style={styles.centered}><Text style={{ color: 'red' }}>Lỗi: {error}</Text></View>;
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen options={{ 
        // An toàn tuyệt đối: Dùng optional chaining đến cấp cuối cùng
        title: submission?.problemId?.title || 'Kết quả' 
      }} />
      
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Kết quả nộp bài</Text>
        <View style={[styles.statusTag, { backgroundColor: statusStyle.backgroundColor }]}>
            <Text style={styles.statusText}>{submission?.status}</Text>
        </View>
      </View>
      
      <View style={[styles.infoBox, { backgroundColor: infoBoxBg }]}>
        <InfoRow label="Ngôn ngữ" value={submission?.language?.toUpperCase() ?? 'N/A'} />
        <InfoRow 
            label="Thời gian" 
            value={submission?.createdAt ? new Date(submission.createdAt).toLocaleString('vi-VN') : 'Đang tải...'} 
        />
        {submission?.executionTime != null && <InfoRow label="Thời gian chạy" value={`${submission.executionTime} ms`} />}
      </View>

      <View style={styles.codeContainer}>
          <Text style={[styles.codeHeader, { color: theme.text }]}>Mã nguồn đã nộp:</Text>
          <CodeEditor
            style={styles.codeEditor}
            language={submission?.language as any}
            syntaxStyle={CodeEditorSyntaxStyles.atomOneDark}
            initialValue={submission?.code ?? ''}
            readOnly
          />
      </View>
    </ScrollView>
  );
}

// Component con để hiển thị một hàng thông tin
const InfoRow = ({ label, value }: { label: string, value: string }) => {
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];
    return (
        <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.icon }]}>{label}</Text>
            <Text style={[styles.infoValue, { color: theme.text }]}>{value}</Text>
        </View>
    )
};

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { flex: 1 },
  header: { padding: 20, alignItems: 'center', gap: 15 },
  title: { fontSize: 22, fontWeight: 'bold' },
  statusTag: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20 },
  statusText: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  infoBox: { marginHorizontal: 16, marginTop: 10, padding: 16, borderRadius: 12, },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  infoLabel: { fontSize: 16 },
  infoValue: { fontSize: 16, fontWeight: '500' },
  codeContainer: { marginTop: 20, marginHorizontal: 16, paddingBottom: 40 }, // Thêm padding bottom
  codeHeader: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  codeEditor: { height: 300, fontSize: 14, padding: 10, borderRadius: 8 },
});