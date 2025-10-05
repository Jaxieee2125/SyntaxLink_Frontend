import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

import Colors from "@/constants/Colors";
import ScreenHeader from "@/components/ScreenHeader";
import { JobPosting } from "@/types/job";
import { getEmployerJobs } from "@/api/employerJobs";
import { useAuth } from "@/context/AuthContext";
import EmployerJobItem from "@/components/EmployerJobItem";

export default function JobListScreen() {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { logout } = useAuth();

  useEffect(() => {
    (async () => {
      try {
        const res = await getEmployerJobs();
        console.log("[getEmployerJobs] Res:", res);
        setJobs(res.data ?? []);
      } catch (err) {
        console.error("[getEmployerJobs] Network error:", err);
        setJobs([]);
      }
    })();
  }, []);

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

      {/* Nội dung chính */}
      <View
        style={{
          flex: 1,
          paddingTop: headerHeight,
          paddingHorizontal: 16,
        }}
      >
        <ScreenHeader title="Công việc" subtitle="Danh sách công việc của bạn" />

        <TouchableOpacity
          onPress={() => router.push("/(employer)/jobs/create")}
          style={[styles.btn, { backgroundColor: theme.chipSelectedBg }]}
        >
          <Text style={{ color: theme.chipSelectedText }}>+ Thêm công việc</Text>
        </TouchableOpacity>

        <FlatList
          data={jobs}
          keyExtractor={(it) => it._id}
          renderItem={({ item }) => <EmployerJobItem item={item} />}
          contentContainerStyle={{ paddingBottom: 50 }}
        />
      </View>

      {/* Nút logout nổi cố định */}
      <TouchableOpacity
        onPress={logout}
        style={[
          styles.logoutButton,
          {
            bottom: tabBarHeight + 20,
            backgroundColor: theme.background,
          },
        ]}
      >
        <Text style={{ color: "red", fontWeight: "bold" }}>Đăng xuất</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  btn: {
    alignSelf: "flex-start",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  logoutButton: {
    position: "absolute",
    right: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});
