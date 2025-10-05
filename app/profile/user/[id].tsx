import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, useColorScheme, SafeAreaView } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { DeveloperProfile } from '@/types/profile';
import { getProfileByUserId } from '@/api/profile'; // Dùng API để lấy profile theo ID
import Colors from '@/constants/Colors';
import CVSection from '@/components/CVSection';
import CVTimelineItem from '@/components/CVTimelineItem';

// Helper để format ngày tháng
const formatDate = (date: string | undefined) => date ? new Date(date).toLocaleDateString('vi-VN', { month: '2-digit', year: 'numeric' }) : 'Hiện tại';

export default function UserProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>(); // Lấy userId từ URL
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  const [profile, setProfile] = useState<DeveloperProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getProfileByUserId(id)
        .then(setProfile)
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  if (isLoading || !profile) {
    return <View style={styles.centered}><ActivityIndicator size="large" color={Colors.danger} /></View>;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <Stack.Screen options={{ title: `Hồ sơ của ${profile.user.name}` }} />
      <ScrollView contentContainerStyle={styles.container}>
        {/* Phần giao diện giống hệt CVScreen */}
        <View style={styles.header}>
          <Text style={[styles.name, { color: theme.text }]}>{profile.user.name}</Text>
          <Text style={[styles.email, { color: theme.textMuted }]}>{profile.user.email}</Text>
        </View>

        {profile.bio && ( <CVSection title="Giới thiệu"> ... </CVSection> )}
        {profile.skills && profile.skills.length > 0 && ( <CVSection title="Kỹ năng"> ... </CVSection> )}
        {profile.experience && profile.experience.length > 0 && ( <CVSection title="Kinh nghiệm"> ... </CVSection> )}
        {profile.projects && profile.projects.length > 0 && ( <CVSection title="Dự án"> ... </CVSection> )}
        {profile.education && profile.education.length > 0 && ( <CVSection title="Học vấn"> ... </CVSection> )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    container: { paddingHorizontal: 24, paddingBottom: 40 },
    header: { alignItems: 'center', marginBottom: 24, paddingTop: 20 },
    name: { fontSize: 28, fontWeight: 'bold' },
    email: { fontSize: 16, marginTop: 4 },
    bio: { fontSize: 16, lineHeight: 24 },
    skillsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    skillTag: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
    skillText: { fontSize: 14, fontWeight: '500' },
});