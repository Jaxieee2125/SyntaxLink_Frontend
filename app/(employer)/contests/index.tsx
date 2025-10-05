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
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { router } from "expo-router";

import Colors from "@/constants/Colors";
import ScreenHeader from "@/components/ScreenHeader";
import { useAuth } from "@/context/AuthContext";
import { getAllContests } from "@/api/contests"; // Bạn cần tạo file này
import { Contest } from "@/types/contest"; // Định nghĩa kiểu dữ liệu

export default function ContestListScreen() {
  const [contests, setContests] = useState<Contest[]>([]);
  const theme = Colors[useColorScheme() ?? "light"];
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { user } = useAuth();
  const getCreatorId = (
    creator: string | { _id?: string } | null | undefined
  ) => (typeof creator === "string" ? creator : creator?._id ?? null);
  useEffect(() => {
    (async () => {
      try {
        const res = await getAllContests();
        console.log(
          "[ContestList] len =",
          Array.isArray(res) ? res.length : res
        );

        if (!Array.isArray(res)) {
          setContests([]);
          return;
        }

        if (user?.role === "employer") {
          const own = res.filter((c: Contest) => {
            const creatorId = getCreatorId(c.creator);
            const match = creatorId && user?._id && creatorId === user._id;
            console.log("[ContestList] check", {
              contest: c._id,
              creatorId,
              userId: user?._id,
              match,
            });
            return Boolean(match);
          });
          setContests(own);
        } else {
          setContests(res); // admin/dev xem tất cả
        }
      } catch (err) {
        console.log("[ContestList] Failed to load contests:", err);
        setContests([]);
      }
    })();
  }, [user?._id, user?.role]);

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
          paddingBottom: tabBarHeight + 60,
        }}
      >
        <ScreenHeader title="Cuộc thi" subtitle="Danh sách cuộc thi của bạn" />

        <TouchableOpacity
          onPress={() => router.push("/(employer)/contests/create")}
          style={[styles.btn, { backgroundColor: theme.chipSelectedBg }]}
        >
          <Text style={{ color: theme.chipSelectedText }}>+ Tạo contest</Text>
        </TouchableOpacity>

        <FlatList
          data={contests}
          keyExtractor={(it) => it._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => router.push({
                        pathname: "/(employer)/contests/[id]",
                        params: { id: item._id },
                      })}
              style={[styles.card, { borderColor: theme.outline }]}
            >
              <Text style={[styles.title, { color: theme.text }]}>
                {item.title}
              </Text>
              <Text style={{ color: theme.textMuted, fontSize: 13 }}>
                {item.description}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
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
  card: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  logoutButton: {
    position: "absolute",
    right: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    elevation: 0,
    shadowOpacity: 0,
  },
});
