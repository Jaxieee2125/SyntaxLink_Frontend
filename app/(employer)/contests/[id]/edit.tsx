import { useEffect, useState, useCallback } from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  useColorScheme,
  Alert,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useHeaderHeight } from '@react-navigation/elements';
import { useLocalSearchParams, router } from 'expo-router';

import Colors from '@/constants/Colors';
import ScreenHeader from '@/components/ScreenHeader';
import ContestForm from '@/components/ContestForm';
import { getContestById, updateContest } from '@/api/contests';
import { ContestDetail } from '@/types/contest';

export default function EditContestScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = Colors[useColorScheme() ?? 'light'];
  const headerHeight = useHeaderHeight();
  const [contest, setContest] = useState<ContestDetail | null>(null);

  const load = useCallback(async () => {
    if (!id) return;
    try {
      const res = await getContestById(id);
      setContest(res);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tải dữ liệu cuộc thi');
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const onSubmit = async (formData: any) => {
    try {
      await updateContest(contest!._id, formData);
      Alert.alert('Thành công', 'Cập nhật cuộc thi thành công');
      router.back();
    } catch (err) {
      Alert.alert('Lỗi', 'Không thể cập nhật cuộc thi');
    }
  };

  if (!contest) return null;

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={[theme.headerGradientStart, theme.headerGradientEnd, theme.background]}
        locations={[0, 0.18, 1]}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView style={{ flex: 1, paddingTop: headerHeight }}>
        <ScrollView contentContainerStyle={{ padding: 16, gap: 14 }}>
          <ScreenHeader title="Chỉnh sửa cuộc thi" subtitle="" />
          <ContestForm
            initial={{
              title: contest.title,
              description: contest.description,
              startTime: new Date(contest.startTime),
              endTime: new Date(contest.endTime),
              problems: contest.problems.map((p) => ({
                problemId: p.problemId._id,
                alias: p.alias,
              })),
            }}
            onSubmit={onSubmit}
            submitLabel="Cập nhật"
          />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
