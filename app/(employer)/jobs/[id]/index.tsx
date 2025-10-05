// Đã cập nhật load + UI đẹp hơn + chip trạng thái
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  useColorScheme,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { useEffect, useState, useCallback } from "react";
import { useHeaderHeight } from "@react-navigation/elements";
import { useLocalSearchParams, router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

import Colors from "@/constants/Colors";
import { getEmployerJobById, deleteEmployerJob } from "@/api/employerJobs";
import { JobPosting } from "@/types/job";
import ScreenHeader from "@/components/ScreenHeader";
import Chip from "@/components/Chip";
import Section from "@/components/Section";
import ActionButton from "@/components/ActionButton";

export default function EmployerJobDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = Colors[useColorScheme() ?? "light"];
  const headerHeight = useHeaderHeight();
  const [job, setJob] = useState<JobPosting | null>(null);

  const load = useCallback(async () => {
    if (!id) return;
    try {
      const job = await getEmployerJobById(id);
      setJob(job);
    } catch (err) {
      console.error("Lỗi load chi tiết job:", err);
      setJob(null);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  if (!job) return null;

  const actDelete = () => {
    Alert.alert("Xoá", "Bạn chắc chắn muốn xoá công việc này?", [
      { text: "Huỷ" },
      {
        text: "Xoá",
        style: "destructive",
        onPress: async () => {
          await deleteEmployerJob(job._id);
          router.back();
        },
      },
    ]);
  };

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={[
          theme.headerGradientStart,
          theme.headerGradientEnd,
          theme.background,
        ]}
        locations={[0, 0.18, 1]}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={{ flex: 1, paddingTop: headerHeight }}>
        <ScrollView contentContainerStyle={{ padding: 16, gap: 14 }}>
          <ScreenHeader title="Chi tiết công việc" subtitle="" />

          {/* Tiêu đề và metadata */}
          <Text style={{ color: theme.text, fontSize: 22, fontWeight: "800" }}>
            {job.title}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Ionicons name="location-outline" size={16} color={theme.icon} />
            <Text style={{ color: theme.textMuted, fontSize: 14 }}>
              {job.location}
            </Text>

            <Text style={{ color: theme.textMuted, marginHorizontal: 6 }}>
              •
            </Text>

            <Ionicons name="cash-outline" size={16} color={theme.icon} />
            <Text style={{ color: theme.textMuted, fontSize: 14 }}>
              {job.salaryRange}
            </Text>
          </View>

          {/* Chip trạng thái */}
          <View style={{ flexDirection: "row", gap: 8, marginTop: 8 }}>
            <Chip
              label={`Duyệt: ${job.moderationStatus}`}
              color={theme.chipBg}
              textColor={theme.chipText}
            />
            <Chip
              label={`Bài: ${job.status}`}
              color={theme.chipSelectedBg}
              textColor={theme.chipSelectedText}
            />
          </View>

          {/* Section mô tả */}
          <Section title="Mô tả công việc">
            <Text style={{ color: theme.text }}>{job.description}</Text>
          </Section>

          {/* Section yêu cầu */}
          <Section title="Yêu cầu ứng viên">
            {job.requirements?.map((r, i) => (
              <Text key={i} style={{ color: theme.textMuted }}>
                • {r}
              </Text>
            ))}
          </Section>

          {/* Nút hành động */}
          <View style={{ flexDirection: "row", gap: 10, marginTop: 32 }}>
            <ActionButton
              label="Chỉnh sửa"
              color={theme.buttonPrimaryBg}
              textColor={theme.buttonPrimaryText}
              onPress={() =>
                router.push({
                  pathname: "/(employer)/jobs/[id]/edit",
                  params: { id: job._id },
                })
              }
            />
            <ActionButton
              label="Xoá"
              color={theme.buttonDangerBg}
              textColor={theme.buttonDangerText}
              onPress={actDelete}
              style={{ marginLeft: "auto" }}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
