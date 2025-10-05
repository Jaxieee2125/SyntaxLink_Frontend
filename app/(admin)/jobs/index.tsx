import { useEffect, useState, useCallback } from "react";
import {
  View,
  TextInput,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  useColorScheme,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useHeaderHeight } from "@react-navigation/elements";
import Colors from "@/constants/Colors";
import { router } from "expo-router";
import { adminListJobs } from "@/api/adminJobs";
import JobCard from "@/components/JobCard";
import { JobPosting, Moderation } from "@/types/job";
import ScreenHeader from "@/components/ScreenHeader";
import { useLocalSearchParams, useFocusEffect } from "expo-router";

export default function AdminJobsList() {
  const theme = Colors[useColorScheme() ?? "light"];
  const headerHeight = useHeaderHeight();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<Moderation>("pending");
  const [items, setItems] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(false);
  const { shouldReload } = useLocalSearchParams();

useFocusEffect(
  useCallback(() => {
    if (shouldReload) {
      load().then(() => {
        // 🧼 Xoá shouldReload khỏi URL sau khi load xong
        router.replace("/(admin)/jobs");
      });
    }
  }, [shouldReload])
);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminListJobs({
        q: q || undefined,
        status,
        limit: 100,
      });
      setItems(res.items);
    } catch (err) {
      console.error("[AdminJobsList] ❌ Error:", err);
    } finally {
      setLoading(false);
    }
  }, [q, status]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <View style={{ flex: 1 }}>
      {/* Gradient nền như header */}
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
        <View style={{ flex: 1, paddingHorizontal: 16 }}>
          <ScreenHeader
            title="Công việc"
            subtitle="Danh sách công việc cần duyệt"
          />

          {/* Tìm kiếm */}
          <View style={{ flexDirection: "row", gap: 8, marginBottom: 12 }}>
            <TextInput
              placeholder="Tìm tiêu đề hoặc mô tả"
              placeholderTextColor={theme.placeholder}
              value={q}
              onChangeText={setQ}
              onSubmitEditing={load}
              style={{
                flex: 1,
                height: 42,
                borderRadius: 12,
                paddingHorizontal: 12,
                backgroundColor: theme.inputBg,
                color: theme.inputText,
                borderColor: theme.outline,
                borderWidth: 1,
              }}
            />
          </View>

          {/* Bộ lọc trạng thái */}
          <View style={{ flexDirection: "row", gap: 8, marginBottom: 12 }}>
            {(["pending", "approved", "rejected"] as Moderation[]).map((s) => {
              const selected = status === s;
              return (
                <TouchableOpacity
                  key={s}
                  onPress={() => setStatus(s)}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 20,
                    borderWidth: 1,
                    backgroundColor: selected
                      ? theme.chipSelectedBg
                      : theme.chipBg,
                    borderColor: selected
                      ? theme.chipSelectedBorder
                      : theme.chipBorder,
                  }}
                >
                  <Text
                    style={{
                      color: selected ? theme.chipSelectedText : theme.chipText,
                    }}
                  >
                    {s}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Danh sách job */}
          <FlatList
            data={items}
            keyExtractor={(it) => it._id}
            contentContainerStyle={{ paddingBottom: 60 }}
            refreshControl={
              <RefreshControl refreshing={loading} onRefresh={load} />
            }
            renderItem={({ item }) => (
              <JobCard
                item={item}
                onPress={() =>
                  router.push({
                    pathname: "/(admin)/jobs/[id]",
                    params: { id: item._id },
                  })
                }
              />
            )}
            ListEmptyComponent={
              !loading ? (
                <Text
                  style={{
                    color: theme.textMuted,
                    textAlign: "center",
                    marginTop: 24,
                  }}
                >
                  Không có job.
                </Text>
              ) : null
            }
          />
        </View>
      </SafeAreaView>
    </View>
  );
}
