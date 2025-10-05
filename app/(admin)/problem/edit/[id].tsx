// app/(admin)/problem/[id]/edit.tsx
import { useEffect, useState } from "react";
import {
  View,
  ActivityIndicator,
  Alert,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  useColorScheme,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useHeaderHeight } from "@react-navigation/elements";
import { LinearGradient } from "expo-linear-gradient";

import Colors from "@/constants/Colors";
import ScreenHeader from "@/components/ScreenHeader";
import ProblemForm from "@/components/ProblemForm";
import { getProblemById, updateProblem } from "@/api/problems";
import { Problem } from "@/types/problem";

export default function EditProblemScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = Colors[useColorScheme() ?? "light"];
  const router = useRouter();
  const headerHeight = useHeaderHeight();

  const [loading, setLoading] = useState(true);
  const [problem, setProblem] = useState<Problem | null>(null);

  useEffect(() => {
    if (!id) return;
    getProblemById(id)
      .then(setProblem)
      .catch(() => Alert.alert("Lỗi", "Không thể tải bài toán"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (data: Partial<Problem>) => {
    try {
      await updateProblem(id, data);
      Alert.alert("Thành công", "Đã cập nhật bài toán.");
      router.replace({ pathname: "/(admin)/problem" });
    } catch (err) {
      Alert.alert("Lỗi", "Không thể cập nhật bài toán");
    }
  };

  if (loading || !problem) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.background,
        }}
      >
        <ActivityIndicator size="large" color={theme.text} />
      </View>
    );
  }

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
        <ScrollView contentContainerStyle={styles.container}>
          <ScreenHeader title="Chỉnh sửa bài toán" subtitle="" />
          <ProblemForm
            initialData={problem}
            onSubmit={handleSubmit}
            submitLabel="Cập nhật"
          />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 100,
    gap: 20,
  },
});
