import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, useColorScheme, Alert, SafeAreaView } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { JobPosting } from '@/types/job';
import { getJobById, applyForJob, checkApplicationStatus } from '@/api/jobs';
import Colors from '@/constants/Colors';
import StyledButton from '@/components/StyledButton';
import { Ionicons } from '@expo/vector-icons';

export default function JobDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  const [job, setJob] = useState<JobPosting | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const loadJobDetails = async () => {
      try {
        setIsLoading(true);
        const [jobData, statusData] = await Promise.all([
            getJobById(id),
            checkApplicationStatus(id)
        ]);
        setJob(jobData);
        setHasApplied(statusData.hasApplied);
      } catch(err: any) {
        setError(err.error || "Không thể tải chi tiết công việc.");
      } finally {
        setIsLoading(false);
      }
    };
    loadJobDetails();
  }, [id]);

  const handleApply = async () => {
    if (!id) return;
    setIsApplying(true);
    try {
        await applyForJob(id);
        Alert.alert("Thành công!", "Hồ sơ của bạn đã được gửi đến nhà tuyển dụng.");
        setHasApplied(true);
    } catch (err: any) {
        Alert.alert("Lỗi", err.error || "Không thể ứng tuyển. Vui lòng thử lại.");
    } finally {
        setIsApplying(false);
    }
  }

  if (isLoading) {
    return <View style={styles.centered}><ActivityIndicator size="large" color={Colors.primary} /></View>;
  }

  if (error || !job) {
    return <View style={styles.centered}><Text style={{ color: Colors.danger }}>Lỗi: {error}</Text></View>;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <Stack.Screen options={{ title: job.title }} />
      <ScrollView style={styles.container}>
        <View style={styles.header}>
            <Text style={[styles.title, { color: theme.text }]}>{job.title}</Text>
            <Text style={[styles.company, { color: theme.textMuted }]}>{job.creator.name}</Text>
            <View style={styles.infoRow}>
                <Ionicons name="location-outline" size={14} color={theme.icon} />
                <Text style={[styles.infoText, { color: theme.textMuted }]}>{job.location}</Text>
            </View>
            <View style={styles.infoRow}>
                <Ionicons name="cash-outline" size={14} color={theme.icon} />
                <Text style={[styles.infoText, { color: theme.textMuted }]}>{job.salaryRange}</Text>
            </View>
        </View>

        <Section title="Mô tả công việc" content={job.description} />
        <Section title="Yêu cầu ứng viên" content={job.requirements.join('\n• ')} prefix="• " />
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: theme.surface, borderTopColor: theme.background }]}>
        <StyledButton 
            title={hasApplied ? "✓ Đã ứng tuyển" : "Ứng tuyển ngay"} 
            onPress={handleApply} 
            isLoading={isApplying}
            disabled={hasApplied || isApplying}
        />
      </View>
    </SafeAreaView>
  );
}

// Component con để giữ code gọn gàng
const Section = ({ title, content, prefix = '' }: { title: string, content: string, prefix?: string }) => {
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];
    return (
        <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>{title}</Text>
            <Text style={[styles.content, { color: theme.textMuted }]}>{prefix}{content}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    container: { flex: 1 },
    header: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#333' },
    title: { fontSize: 24, fontWeight: 'bold' },
    company: { fontSize: 18, fontWeight: '500', marginTop: 4, marginBottom: 12 },
    infoRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
    infoText: { fontSize: 14 },
    section: { padding: 20 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
    content: { fontSize: 16, lineHeight: 24 },
    footer: { padding: 20, borderTopWidth: 1, paddingBottom: 50 }
});