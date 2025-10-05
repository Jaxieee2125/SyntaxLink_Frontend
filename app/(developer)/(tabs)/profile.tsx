import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  useColorScheme,
  TouchableOpacity,
  Linking,
  SafeAreaView,
  StyleSheet as RNStyleSheet,
} from "react-native";
import { useFocusEffect, router } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { DeveloperProfile, UserStats } from "@/types/profile";
import { getMyProfile, getMyStats } from "@/api/profile";
import Colors from "@/constants/Colors";
import StyledButton from "@/components/StyledButton";
import { Ionicons } from "@expo/vector-icons";
import { ApiError } from "@/types/auth";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const StatCard = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];
  const cardBg = theme.surface;

  return (
    <View style={[styles.statCard, { backgroundColor: cardBg }]}>
      <Text style={[styles.statValue, { color: theme.text }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: theme.textMuted }]}>
        {label}
      </Text>
    </View>
  );
};

export default function ProfileScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];
  const { user, logout } = useAuth();

  const [profile, setProfile] = useState<DeveloperProfile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const insets = useSafeAreaInsets();
  const tabBarHeight = 72 + 28; // 72 là height, 28 là phần floating circle
  const bottomPadding = tabBarHeight + insets.bottom;

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const profilePromise = getMyProfile();
    const statsPromise = getMyStats();

    const [profileResult, statsResult] = await Promise.allSettled([
      profilePromise,
      statsPromise,
    ]);

    let encounteredError: string | null = null;

    if (profileResult.status === "fulfilled") {
      setProfile(profileResult.value);
    } else {
      const reason = profileResult.reason as ApiError;
      if (!reason?.error?.includes("profile not found")) {
        encounteredError = reason?.error || "Lỗi tải thông tin hồ sơ.";
      }
      setProfile(null);
    }

    if (statsResult.status === "fulfilled") {
      setStats(statsResult.value);
    } else {
      const reason = statsResult.reason as ApiError;
      encounteredError = reason?.error || "Lỗi tải dữ liệu thống kê.";
      setStats(null);
    }

    if (encounteredError) {
      setError(encounteredError);
    }

    setIsLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  if (isLoading) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.headerGradientStart} />
      </View>
    );
  }

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
        style={RNStyleSheet.absoluteFill}
      />

      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingTop: 16,
            paddingHorizontal: 16,
            paddingBottom: bottomPadding,
          }}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={loadData}
              tintColor={theme.headerGradientStart}
            />
          }
        >
          <View style={styles.header}>
            <Ionicons
              name="person-circle-outline"
              size={80}
              color={theme.text}
            />
            <Text style={[styles.name, { color: theme.text }]}>
              {user?.name}
            </Text>
            <Text style={[styles.email, { color: theme.textMuted }]}>
              {user?.email}
            </Text>
          </View>

          <View style={styles.statsContainer}>
            <StatCard label="Bài đã giải" value={stats?.problemsSolved ?? 0} />
            <StatCard label="Lượt nộp" value={stats?.totalSubmissions ?? 0} />
            <StatCard
              label="Tỷ lệ AC"
              value={`${stats?.acceptanceRate ?? 0}%`}
            />
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Giới thiệu
            </Text>
            <Text style={[styles.bio, { color: theme.textMuted }]}>
              {profile?.bio ||
                "Chưa có giới thiệu. Hãy cập nhật hồ sơ của bạn!"}
            </Text>
          </View>

          {error && (
            <Text style={[styles.errorText, { color: Colors.danger }]}>
              {error}
            </Text>
          )}

          {profile?.social && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Liên kết
              </Text>
              <View style={styles.socialContainer}>
                {profile.social.github && (
                  <SocialIcon icon="logo-github" url={profile.social.github} />
                )}
                {profile.social.linkedin && (
                  <SocialIcon
                    icon="logo-linkedin"
                    url={profile.social.linkedin}
                  />
                )}
                {profile.social.website && (
                  <SocialIcon
                    icon="globe-outline"
                    url={profile.social.website}
                  />
                )}
              </View>
            </View>
          )}

          <View style={styles.buttonContainer}>
            <StyledButton
              title="Đơn ứng tuyển của tôi"
              onPress={() => router.push("/profile/my-applications")}
            />
            <View style={{ height: 10 }} />
            <StyledButton
              title="Xem CV"
              onPress={() => router.push("/profile/cv")}
            />
            <View style={{ height: 10 }} />
            <StyledButton
              title="Chỉnh sửa hồ sơ"
              onPress={() => router.push("/profile/edit")}
            />
            <View style={{ height: 10 }} />
            <StyledButton title="Đăng xuất" onPress={logout} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const SocialIcon = ({ icon, url }: { icon: any; url: string }) => {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];
  return (
    <TouchableOpacity onPress={() => Linking.openURL(url)}>
      <Ionicons name={icon} size={30} color={theme.headerGradientStart} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { alignItems: "center", paddingVertical: 30 },
  name: { fontSize: 24, fontWeight: "bold", marginTop: 10 },
  email: { fontSize: 16, marginTop: 4 },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    marginHorizontal: 16,
  },
  statCard: {
    alignItems: "center",
    flex: 1,
    paddingVertical: 16,
    marginHorizontal: 4,
    borderRadius: 12,
  },
  statValue: { fontSize: 22, fontWeight: "bold" },
  statLabel: { fontSize: 14, marginTop: 4 },
  section: { paddingVertical: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  bio: { fontSize: 16, lineHeight: 24 },
  buttonContainer: { paddingVertical: 20 },
  errorText: { textAlign: "center", marginHorizontal: 20, marginBottom: 10 },
  socialContainer: {
    flexDirection: "row",
    gap: 20,
  },
});
