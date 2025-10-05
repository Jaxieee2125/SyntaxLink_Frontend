import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  RefreshControl,
  useColorScheme,
  SafeAreaView,
} from "react-native";
import { router } from "expo-router";
import { useHeaderHeight } from "@react-navigation/elements";
import { LinearGradient } from "expo-linear-gradient";

import Colors from "@/constants/Colors";
import { Problem } from "@/types/problem";
import { getAllProblems } from "@/api/problems";
import ProblemListItem from "@/components/ProblemListItem";
import ScreenHeader from "@/components/ScreenHeader";
import FilterChips from "@/components/FilterChips";
import SearchBar from "@/components/SearchBar";
import { useAuth } from "@/context/AuthContext";
import { getGreeting } from "@/utils/time";
import SkeletonListItem from "@/components/SkeletonListItem";

type DifficultyFilter = "All" | "Easy" | "Medium" | "Hard";

export default function ProblemListScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];
  const { user } = useAuth();
  const headerHeight = useHeaderHeight();

  const [allProblems, setAllProblems] = useState<Problem[]>([]);
  const [filter, setFilter] = useState<DifficultyFilter>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProblems = useCallback(async () => {
    try {
      setError(null);
      setIsLoading(true);
      const data = await getAllProblems();
      setAllProblems(data);
    } catch (err: any) {
      setError(err.error || "Không thể tải danh sách bài tập.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProblems();
  }, [fetchProblems]);

  const filteredProblems = useMemo(() => {
    let problems = allProblems;
    if (filter !== "All")
      problems = problems.filter((p) => p.difficulty === filter);
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      problems = problems.filter((p) => p.title.toLowerCase().includes(q));
    }
    return problems;
  }, [filter, allProblems, searchQuery]);

  const onRefresh = () => fetchProblems();
  const renderDifficultyLabel = (opt: DifficultyFilter) =>
    opt === "All" ? "Tất cả" : opt;

  const renderSkeleton = () => (
    <View style={{ paddingTop: 8 }}>
      {[...Array(5)].map((_, i) => (
        <SkeletonListItem key={i} />
      ))}
    </View>
  );

  const renderContent = () => {
    if (isLoading && !allProblems.length) return renderSkeleton();
    if (error)
      return (
        <View style={styles.centered}>
          <Text style={{ color: Colors.danger }}>Lỗi: {error}</Text>
        </View>
      );
    return (
      <FlatList
        data={filteredProblems}
        renderItem={({ item }) => (
          <ProblemListItem
            item={item}
            onPress={() => {
              console.log("[DEBUG] Pressed item:", item._id); // ✅ LOG tại đây
              router.push(`/problem/${item._id}`);
            }}
          />
        )}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={
          <View style={styles.centeredEmpty}>
            <Text style={{ color: theme.textMuted }}>
              Không có bài tập nào phù hợp.
            </Text>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={onRefresh}
            tintColor={theme.text}
          />
        }
        contentContainerStyle={styles.listContainer}
        keyboardDismissMode="on-drag"
      />
    );
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
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={{ flex: 1, paddingTop: headerHeight }}>
        <View style={{ flex: 1, paddingHorizontal: 16 }}>
          <ScreenHeader
            subtitle={`${getGreeting()}, ${user?.name || "Developer"}!`}
            title="Thử thách hôm nay"
          />

          {/* Ép màu input để không “lẫn” với nền */}
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Tìm kiếm theo tên bài tập..."
            // các prop tuỳ biến (nếu component hỗ trợ)
            inputStyle={{
              backgroundColor: theme.inputBg,
              color: theme.inputText,
              borderColor: theme.outline,
            }}
            placeholderTextColor={theme.placeholder}
            iconColor={theme.icon}
            caretHidden={false}
            selectionColor={theme.caret}
          />

          {/* Ép màu chip: nền, viền, text, trạng thái selected */}
          <FilterChips
            options={["All", "Easy", "Medium", "Hard"]}
            selected={filter}
            onSelect={setFilter}
            renderLabel={renderDifficultyLabel}
            // các prop tuỳ biến (nếu component hỗ trợ)
            chipStyle={{
              backgroundColor: theme.chipBg,
              borderColor: theme.chipBorder,
            }}
            chipTextStyle={{ color: theme.chipText }}
            selectedChipStyle={{
              backgroundColor: theme.chipSelectedBg,
              borderColor: theme.chipSelectedBorder,
            }}
            selectedChipTextStyle={{
              color: theme.chipSelectedText,
              fontWeight: "600",
            }}
            containerStyle={{ marginTop: 8, marginBottom: 8 }}
          />

          <View style={styles.listContent}>{renderContent()}</View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  centeredEmpty: { padding: 40, alignItems: "center" },
  listContainer: { paddingBottom: 120 },
  listContent: { flex: 1 },
});
