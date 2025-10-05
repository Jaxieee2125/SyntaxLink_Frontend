import { useEffect, useState, useCallback } from 'react';
import { View, SafeAreaView, StyleSheet, useColorScheme, Alert, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useHeaderHeight } from '@react-navigation/elements';
import { useLocalSearchParams, router } from 'expo-router';
import Colors from '@/constants/Colors';
import EmployerJobForm from '@/components/EmployerJobForm';
import { getEmployerJobById, updateEmployerJob } from '@/api/employerJobs';
import ScreenHeader from '@/components/ScreenHeader';
import { JobPosting } from '@/types/job';

export default function EmployerEditJob() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = Colors[useColorScheme() ?? 'light'];
  const headerHeight = useHeaderHeight();
  const [job, setJob] = useState<JobPosting | null>(null);

  const load = useCallback(async () => {
    const data = await getEmployerJobById(id);
    setJob(data);
  }, [id]);

  useEffect(() => { load(); }, [load]);

  if (!job) return null;

  const onSubmit = async (v: any) => {
    await updateEmployerJob(job._id, v);
    Alert.alert('Thành công', 'Đã cập nhật công việc');
    router.back(); // quay về list
  };

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient colors={[theme.headerGradientStart, theme.headerGradientEnd, theme.background]} locations={[0,0.18,1]} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={{ flex: 1, paddingTop: headerHeight }}>
        <ScrollView contentContainerStyle={{ padding: 16, gap: 14 }}>
          <ScreenHeader title="Chỉnh sửa công việc" subtitle="" />
          <EmployerJobForm
            initial={{
              title: job.title,
              description: job.description,
              requirements: job.requirements,
              salaryRange: job.salaryRange,
              location: job.location,
            }}
            onSubmit={onSubmit}
            submitLabel="Cập nhật"
          />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
