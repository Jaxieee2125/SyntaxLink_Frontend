import {
  View,
  Text,
  ScrollView,
  Alert,
  useColorScheme,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useEffect, useState, useCallback } from "react";
import { useHeaderHeight } from "@react-navigation/elements";
import { useLocalSearchParams, router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

import Colors from "@/constants/Colors";
import { getContestById, deleteContest } from "@/api/contests";
import { ContestDetail } from "@/types/contest";
import ScreenHeader from "@/components/ScreenHeader";
import Chip from "@/components/Chip";
import Section from "@/components/Section";
import ActionButton from "@/components/ActionButton";

export default function ContestDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = Colors[useColorScheme() ?? "light"];
  const headerHeight = useHeaderHeight();
  const [contest, setContest] = useState<ContestDetail | null>(null);

  const load = useCallback(async () => {
    if (!id) return;
    try {
      const res = await getContestById(id);
      setContest(res);
    } catch (err) {
      console.error("Lỗi load contest:", err);
      setContest(null);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const actDelete = () => {
    if (!contest) return;
    Alert.alert("Xoá", "Bạn chắc chắn muốn xoá cuộc thi này?", [
      { text: "Huỷ" },
      {
        text: "Xoá",
        style: "destructive",
        onPress: async () => {
          await deleteContest(contest._id);
          router.back();
        },
      },
    ]);
  };

  if (!contest) return null;

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
          <ScreenHeader title="Chi tiết cuộc thi" subtitle=""/>

          {/* Tiêu đề và metadata */}
          <Text style={{ color: theme.text, fontSize: 22, fontWeight: "800" }}>
            {contest.title}
          </Text>

          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Ionicons name="calendar-outline" size={16} color={theme.icon} />
            <Text style={{ color: theme.textMuted, fontSize: 14 }}>
              {new Date(contest.startTime).toLocaleString()} →{" "}
              {new Date(contest.endTime).toLocaleString()}
            </Text>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Ionicons name="person-circle-outline" size={16} color={theme.icon} />
            <Text style={{ color: theme.textMuted, fontSize: 14 }}>
              {contest.creator.name}
            </Text>
          </View>

          {/* Chip trạng thái */}
          <View style={{ flexDirection: "row", gap: 8, marginTop: 8 }}>
            <Chip
              label={`Số bài: ${contest.problems.length}`}
              color={theme.chipBg}
              textColor={theme.chipText}
            />
            <Chip
              label={`Thí sinh: ${contest.participants.length}`}
              color={theme.chipSelectedBg}
              textColor={theme.chipSelectedText}
            />
          </View>

          {/* Mô tả */}
          <Section title="Mô tả">
            <Text style={{ color: theme.text }}>{contest.description}</Text>
          </Section>

          {/* Danh sách bài toán */}
          <Section title="Danh sách bài toán">
            {contest.problems.map((p, index) => (
              <Text key={index} style={{ color: theme.text }}>
                {p.alias}. {p.problemId.title}
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
                  pathname: "/(employer)/contests/[id]/edit",
                  params: { id: contest._id },
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
