// app/(admin)/problem/create.tsx
import React, { useState } from "react";
import {
  View,
  Alert,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  useColorScheme,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

import Colors from "@/constants/Colors";
import ScreenHeader from "@/components/ScreenHeader";
import ProblemForm from "@/components/ProblemForm";
import { createProblem } from "@/api/problems";
import { Problem } from "@/types/problem";

export default function CreateProblemScreen() {
  const theme = Colors[useColorScheme() ?? "light"];
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (data: Partial<Problem>) => {
    try {
      setSubmitting(true);
      await createProblem(data);
      Alert.alert("Thành công", "Đã tạo bài toán.");
      router.back();
    } catch (error: any) {
      Alert.alert("Lỗi", error?.error || "Không thể tạo bài toán.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={[theme.headerGradientStart, theme.headerGradientEnd, theme.background]}
        locations={[0, 0.18, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container}>
          <ScreenHeader title="Tạo bài toán" subtitle="" />
          <ProblemForm onSubmit={handleSubmit} submitLabel="Tạo" />
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
