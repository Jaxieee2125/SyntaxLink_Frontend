import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { JobPosting } from "@/types/job";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function EmployerJobItem({ item }: { item: JobPosting }) {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];
  const cardBorderColor = colorScheme === "light" ? "#E5E7EB" : "#374151";

  return (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: "/(employer)/jobs/[id]",
          params: { id: item._id },
        })
      }
      style={[
        styles.container,
        { backgroundColor: theme.surface, borderColor: cardBorderColor },
      ]}
    >
      <View style={styles.iconContainer}>
        <Ionicons name="construct-outline" size={22} color={Colors.primary} />
      </View>
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.text }]}>{item.title}</Text>

        <View style={styles.detailsContainer}>
          <Ionicons name="location-outline" size={14} color={theme.icon} />
          <Text numberOfLines={1} style={[styles.detailText, { color: theme.textMuted }]}>
            {item.location}
          </Text>
          <Text style={[styles.dot, { color: theme.textMuted }]}>•</Text>
          <Ionicons name="cash-outline" size={14} color={theme.icon} />
          <Text style={[styles.detailText, { color: theme.textMuted }]}>
            {item.salaryRange}
          </Text>
        </View>

        <View style={styles.tagsRow}>
          <Tag label={item.status === "open" ? "Đang mở" : "Đã đóng"} color={item.status === "open" ? "#10b981" : "#ef4444"} />
          <Tag label={mapModeration(item.moderationStatus)} color="#3b82f6" />
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color={theme.icon} />
    </TouchableOpacity>
  );
}

function Tag({ label, color }: { label: string; color: string }) {
  return (
    <View style={[styles.tag, { backgroundColor: color + "20", borderColor: color }]}>
      <Text style={{ color, fontSize: 11, fontWeight: "500" }}>{label}</Text>
    </View>
  );
}

function mapModeration(status?: string) {
  switch (status) {
    case "pending": return "Chờ duyệt";
    case "approved": return "Đã duyệt";
    case "rejected": return "Từ chối";
    default: return "—";
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  iconContainer: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: Colors.primaryLight + "20",
    marginRight: 16,
  },
  content: {
    flex: 1,
    gap: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  detailsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  dot: {
    marginHorizontal: 4,
    fontSize: 12,
  },
  detailText: {
    fontSize: 13,
  },
  tagsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    borderWidth: 1,
  },
});
