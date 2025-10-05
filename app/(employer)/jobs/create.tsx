import { View, SafeAreaView, StyleSheet, useColorScheme, Alert, ScrollView, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useHeaderHeight } from '@react-navigation/elements';
import Colors from '@/constants/Colors';
import EmployerJobForm from '@/components/EmployerJobForm';
import { createEmployerJob } from '@/api/employerJobs';
import { router } from 'expo-router';
import ScreenHeader from '@/components/ScreenHeader';

export default function EmployerCreateJob() {
  const theme = Colors[useColorScheme() ?? 'light'];
  const headerHeight = useHeaderHeight();

  const onSubmit = async (v: any) => {
    await createEmployerJob(v);
    Alert.alert('Thành công', 'Đã tạo công việc');
    router.back(); // quay về list
  };

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient colors={[theme.headerGradientStart, theme.headerGradientEnd, theme.background]} locations={[0,0.18,1]} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={{ flex: 1, paddingTop: headerHeight }}>
        <ScrollView contentContainerStyle={{ padding: 16, gap: 14 }}>
          <ScreenHeader title="Tạo công việc" subtitle="Điền thông tin chi tiết" />
          <EmployerJobForm onSubmit={onSubmit} submitLabel="Tạo công việc" />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
