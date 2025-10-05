import {
  View,
  StyleSheet,
  useColorScheme,
  FlatList,
  Text,
  TouchableOpacity,
} from "react-native";
import { useEffect, useState } from "react";
import { useHeaderHeight } from "@react-navigation/elements";
import { LinearGradient } from "expo-linear-gradient";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

import Colors from "@/constants/Colors";
import ScreenHeader from "@/components/ScreenHeader";
import { getSystemStats } from "@/api/admin";
import { useAuth } from "@/context/AuthContext";

const cards = [
  { key: "users", label: "Người dùng" },
  { key: "problems", label: "Bài toán" },
  { key: "submissions", label: "Bài nộp" },
  { key: "contests", label: "Cuộc thi" },
  { key: "jobs", label: "Tuyển dụng" },
];

export default function AdminDashboard() {
  const theme = Colors[useColorScheme() ?? "light"];
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { logout } = useAuth();
  const [stats, setStats] = useState<any | null>(null);

  useEffect(() => {
    getSystemStats()
      .then(setStats)
      .catch(() => setStats(null));
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

      <View
        style={{
          flex: 1,
          paddingTop: headerHeight,
          paddingHorizontal: 16,
        }}
      >
        <ScreenHeader title="Bảng điều khiển" subtitle="Tổng quan hệ thống" />

        <FlatList
          data={cards}
          numColumns={2}
          columnWrapperStyle={{ gap: 12 }}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <View
              style={[
                styles.card,
                {
                  backgroundColor: theme.chipBg,
                  borderColor: theme.chipBorder,
                },
              ]}
            >
              <Text style={{ color: theme.chipText, fontSize: 13 }}>
                {item.label}
              </Text>
              <Text
                style={{ color: theme.text, fontSize: 24, fontWeight: "700" }}
              >
                {stats ? stats[item.key] : "—"}
              </Text>
            </View>
          )}
          keyExtractor={(it) => it.key}
        />
      </View>

      {/* Nút logout nổi cố định, không bị che */}
      <TouchableOpacity
        onPress={logout}
        style={[
          styles.logoutButton,
          {
            bottom: tabBarHeight + 32,
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
  card: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    height: 100,
    justifyContent: "space-between",
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
