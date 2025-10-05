import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  useColorScheme,
  SafeAreaView,
} from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import { LinearGradient } from "expo-linear-gradient";
import { LeaderboardEntry } from "@/types/leaderboard";
import { getLeaderboard } from "@/api/leaderboard";
import Colors from "@/constants/Colors";
import ScreenHeader from "@/components/ScreenHeader";
import { useAuth } from "@/context/AuthContext";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function LeaderboardScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];
  const headerHeight = useHeaderHeight();
  const { user } = useAuth();

  const [data, setData] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const insets = useSafeAreaInsets();
  const tabBarHeight = 72 + 28; // 72 là height, 28 là phần floating circle
  const bottomPadding = tabBarHeight + insets.bottom;

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const rows = await getLeaderboard();
      setData(rows);
    } catch (e: any) {
      setError(e?.error || "Không thể tải bảng xếp hạng.");
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    setIsLoading(true);
    fetchData();
  }, [fetchData]);

  const top3 = useMemo(() => data.slice(0, 3), [data]);
  const others = useMemo(() => data.slice(3), [data]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const Podium = () => (
    <View style={styles.podiumWrap}>
      {top3.map((it, idx) => {
        const rank = idx + 1;
        const isCurrent = user?._id === it.userId;
        const bg =
          rank === 1
            ? theme.chipSelectedBg
            : rank === 2
            ? theme.chipBg
            : theme.surface;
        const border =
          rank === 1
            ? theme.chipSelectedBorder
            : rank === 2
            ? theme.chipBorder
            : theme.outline;

        const height = rank === 1 ? 120 : rank === 2 ? 96 : 84;

        return (
          <View key={it.userId} style={[styles.podiumCol]}>
            <View
              style={[
                styles.podiumBar,
                { height, backgroundColor: bg, borderColor: border },
              ]}
            >
              <View style={styles.podiumRankIcon}>
                {rank === 1 ? (
                  <FontAwesome name="trophy" size={18} color={Colors.primary} />
                ) : null}
                {rank === 2 ? (
                  <FontAwesome name="star" size={16} color={theme.text} />
                ) : null}
                {rank === 3 ? (
                  <FontAwesome name="star-o" size={16} color={theme.text} />
                ) : null}
              </View>
              <Text
                numberOfLines={1}
                style={[
                  styles.podiumName,
                  { color: isCurrent ? Colors.primary : theme.text },
                ]}
              >
                {it.name}
                {isCurrent ? " (Bạn)" : ""}
              </Text>
              <Text style={[styles.podiumScore, { color: theme.textMuted }]}>
                {it.problemsSolved} bài
              </Text>
            </View>
            <Text
              style={[styles.podiumRankLabel, { color: theme.text }]}
            >{`#${rank}`}</Text>
          </View>
        );
      })}
    </View>
  );

  const TableHeader = () => (
    <View
      style={[
        styles.row,
        styles.headerRow,
        { borderBottomColor: theme.surface },
      ]}
    >
      <Text
        style={[styles.headerCell, styles.rankCell, { color: theme.textMuted }]}
      >
        #
      </Text>
      <Text
        style={[styles.headerCell, styles.nameCell, { color: theme.textMuted }]}
      >
        Thí sinh
      </Text>
      <Text
        style={[
          styles.headerCell,
          styles.solvedCell,
          { color: theme.textMuted },
        ]}
      >
        Số bài giải
      </Text>
    </View>
  );

  const Row = ({ item, index }: { item: LeaderboardEntry; index: number }) => {
    const isCurrent = user?._id === item.userId;
    const rowBg = isCurrent
      ? Colors.primaryLight + "20"
      : index % 2 === 0
      ? theme.surface
      : "transparent";
    return (
      <View style={[styles.row, { backgroundColor: rowBg }]}>
        <Text style={[styles.cell, styles.rankCell, { color: theme.text }]}>
          {index + 4}
        </Text>
        <Text
          style={[
            styles.cell,
            styles.nameCell,
            { color: isCurrent ? Colors.primary : theme.text },
          ]}
          numberOfLines={1}
        >
          {item.name}
          {isCurrent ? " (Bạn)" : ""}
        </Text>
        <Text style={[styles.cell, styles.solvedCell, { color: theme.text }]}>
          {item.problemsSolved}
        </Text>
      </View>
    );
  };

  const Skeleton = () => (
    <View style={{ paddingTop: 8 }}>
      {Array.from({ length: 6 }).map((_, i) => (
        <View key={i} style={[styles.row, { opacity: 0.4 }]}>
          <View style={[styles.skelBox, styles.rankCell]} />
          <View style={[styles.skelBox, styles.nameCell]} />
          <View style={[styles.skelBox, styles.solvedCell]} />
        </View>
      ))}
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={[
          theme.headerGradientStart,
          theme.headerGradientEnd,
          theme.background,
        ]}
        locations={[0, 0.18, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={{ flex: 1, paddingTop: headerHeight }}>
        <View style={{ flex: 1, paddingHorizontal: 16 }}>
          <ScreenHeader title="Bảng xếp hạng" subtitle="Xem ai đang dẫn đầu" />

          {isLoading && !data.length ? (
            <Skeleton />
          ) : error ? (
            <View style={styles.centered}>
              <Text style={{ color: Colors.danger }}>Lỗi: {error}</Text>
            </View>
          ) : (
            <>
              <Podium />

              <FlatList
                data={others}
                keyExtractor={(item) => item.userId}
                renderItem={({ item, index }) => (
                  <Row item={item} index={index} />
                )}
                ListHeaderComponent={<TableHeader />}
                ListEmptyComponent={
                  <Text
                    style={{
                      textAlign: "center",
                      marginTop: 40,
                      color: theme.textMuted,
                    }}
                  >
                    Chưa có ai trên bảng xếp hạng.
                  </Text>
                }
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    tintColor={theme.text}
                  />
                }
                contentContainerStyle={{ paddingBottom: bottomPadding }}
                stickyHeaderIndices={[0]}
              />
            </>
          )}

          {isLoading && data.length > 0 ? (
            <View style={{ paddingVertical: 12 }}>
              <ActivityIndicator size="small" color={Colors.primary} />
            </View>
          ) : null}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  centered: { padding: 20, alignItems: "center", justifyContent: "center" },
  row: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 12,
    alignItems: "center",
  },
  headerRow: { borderBottomWidth: 2 },
  headerCell: { fontWeight: "bold", fontSize: 13, textTransform: "uppercase" },
  cell: { fontSize: 16 },
  rankCell: { flex: 0.18, textAlign: "center", fontWeight: "bold" },
  nameCell: { flex: 0.52, fontWeight: "500" },
  solvedCell: { flex: 0.3, textAlign: "center", fontWeight: "bold" },

  skelBox: { height: 18, borderRadius: 6, backgroundColor: "#999" },

  podiumWrap: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 4,
    paddingTop: 8,
    paddingBottom: 16,
    alignItems: "flex-end",
  },
  podiumCol: { flex: 1, alignItems: "center" },
  podiumBar: {
    width: "100%",
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  podiumRankIcon: { position: "absolute", top: 8, right: 10 },
  podiumName: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 8,
  },
  podiumScore: { fontSize: 12, textAlign: "center", marginTop: 4 },
  podiumRankLabel: { marginTop: 6, fontWeight: "700", fontSize: 14 },
});
