import { useEffect, useState, useCallback } from "react";
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
import { useHeaderHeight } from "@react-navigation/elements";
import { useLocalSearchParams, router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "@/constants/Colors";
import { adminGetJob, adminApproveJob, adminDeleteJob } from "@/api/adminJobs";
import { JobPosting } from "@/types/job";
import ScreenHeader from "@/components/ScreenHeader";

export default function AdminJobDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = Colors[useColorScheme() ?? "light"];
  const headerHeight = useHeaderHeight();
  const [job, setJob] = useState<JobPosting | null>(null);

  const load = useCallback(async () => {
    const data = await adminGetJob(id);
    setJob(data);
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  if (!job) return null;

  const actApprove = async (decision: "approved" | "rejected") => {
    await adminApproveJob(job._id, decision);
    Alert.alert(
      "Thành công",
      decision === "approved" ? "Đã duyệt job" : "Đã từ chối job"
    );
    router.back();
  };

  const actDelete = () => {
    Alert.alert("Xoá", "Bạn chắc chắn muốn xoá job này?", [
      { text: "Huỷ" },
      {
        text: "Xoá",
        style: "destructive",
        onPress: async () => {
          await adminDeleteJob(job._id);
          router.back();
        },
      },
    ]);
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Gradient nền trên cùng */}
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
          <Text style={{ color: theme.text, fontSize: 22, fontWeight: "800" }}>
            {job.title}
          </Text>
          <Text style={{ color: theme.textMuted }}>
            {job.location} • {job.salaryRange}
          </Text>
          <Text style={{ color: theme.textMuted }}>
            Trạng thái: {job.moderationStatus} • Trạng thái bài: {job.status}
          </Text>

          <Section title="Mô tả">
            <Text style={{ color: theme.text }}>{job.description}</Text>
          </Section>

          <Section title="Yêu cầu">
            {job.requirements?.map((r, i) => (
              <Text key={i} style={{ color: theme.textMuted }}>
                • {r}
              </Text>
            ))}
          </Section>

          <View style={{ flexDirection: "row", gap: 10, marginTop: 24 }}>
            <ActionButton
              label="Duyệt"
              color={theme.buttonPrimaryBg}
              textColor={theme.buttonPrimaryText}
              onPress={() => actApprove("approved")}
            />
            <TouchableOpacity
              onPress={() => actApprove("rejected")}
              style={{
                paddingVertical: 10,
                paddingHorizontal: 16,
                borderRadius: 12,
                backgroundColor: theme.buttonSecondaryBg,
              }}
            >
              <Text
                style={{ color: theme.buttonSecondaryText, fontWeight: "600" }}
              >
                Từ chối
              </Text>
            </TouchableOpacity>
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

// Section wrapper
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const theme = Colors[useColorScheme() ?? "light"];
  return (
    <View style={{ gap: 6 }}>
      <Text style={{ color: theme.text, fontWeight: "700", marginTop: 10 }}>
        {title}
      </Text>
      {children}
    </View>
  );
}

// Reusable ActionButton
function ActionButton({
  label,
  onPress,
  color,
  textColor = "#000",
  border,
  style = {},
}: {
  label: string;
  onPress: () => void;
  color: string;
  textColor?: string;
  border?: string;
  style?: object;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        {
          paddingVertical: 10,
          paddingHorizontal: 16,
          borderRadius: 12,
          backgroundColor: color,
          borderWidth: border ? 1 : 0,
          borderColor: border ?? "transparent",
        },
        style,
      ]}
    >
      <Text style={{ color: textColor, fontWeight: "700" }}>{label}</Text>
    </TouchableOpacity>
  );
}
