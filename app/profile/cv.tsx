import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, useColorScheme, SafeAreaView, Alert, TouchableOpacity } from 'react-native';
import { Stack, useNavigation } from 'expo-router';
import { DeveloperProfile } from '@/types/profile';
import { getMyProfile } from '@/api/profile';
import Colors from '@/constants/Colors';
import CVSection from '@/components/CVSection';
import CVTimelineItem from '@/components/CVTimelineItem';
import { Ionicons } from '@expo/vector-icons';
import * as Sharing from 'expo-sharing';
import { useAuth } from '@/context/AuthContext';
import { downloadMyCv } from '@/api/profile'; // Import hàm tải CV mới

// Helper để format ngày tháng (giữ nguyên)
const formatDate = (date: string | undefined) => date ? new Date(date).toLocaleDateString('vi-VN', { month: '2-digit', year: 'numeric' }) : 'Hiện tại';

export default function CVScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const navigation = useNavigation();
  const { token, user } = useAuth(); // Lấy token và user từ context để gọi API

  const [profile, setProfile] = useState<DeveloperProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false); // Thêm state để quản lý nút download

  useEffect(() => {
    getMyProfile().then(setProfile).finally(() => setIsLoading(false));
  }, []);
  
  // Hàm mới: Tải và chia sẻ CV từ backend
  const downloadAndShareCv = async () => {
    if (!token || !user) {
      Alert.alert('Lỗi', 'Không thể xác thực người dùng.');
      return;
    }

    setIsDownloading(true);
    try {
        // 1. Gọi API để tải file PDF về bộ nhớ tạm của điện thoại
        const fileUri = await downloadMyCv(token, user.name);

        // 2. Kiểm tra xem chức năng chia sẻ có khả dụng không
        if (!(await Sharing.isAvailableAsync())) {
            Alert.alert('Lỗi', 'Chức năng chia sẻ không khả dụng trên thiết bị này.');
            return;
        }
        
        // 3. Mở hộp thoại chia sẻ của hệ điều hành với file đã tải về
        await Sharing.shareAsync(fileUri, { dialogTitle: 'Chia sẻ hoặc lưu CV của bạn' });

    } catch (error) {
        console.error("Download/Share CV Error:", error);
        Alert.alert('Lỗi', 'Không thể tải CV từ server.');
    } finally {
        setIsDownloading(false);
    }
  };

  // Thêm nút "Chia sẻ" vào header sau khi đã có dữ liệu
  useEffect(() => {
    if (profile) {
      navigation.setOptions({
        headerRight: () => (
          // Thêm ActivityIndicator khi đang tải
          isDownloading ? (
            <ActivityIndicator style={{ marginRight: 15 }} color={theme.text} />
          ) : (
            <TouchableOpacity onPress={downloadAndShareCv} style={{ marginRight: 15 }}>
              <Ionicons name="share-outline" size={24} color={theme.text} />
            </TouchableOpacity>
          )
        ),
      });
    }
  }, [profile, isDownloading, navigation, theme]); // Thêm isDownloading vào dependency
  
  if (isLoading || !profile) {
    return <View style={styles.centered}><ActivityIndicator size="large" color={Colors.primary} /></View>;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <Stack.Screen options={{ title: `CV của ${profile.user.name}` }} />
      <ScrollView contentContainerStyle={styles.container}>
        {/* Phần giao diện hiển thị CV giữ nguyên */}
        <View style={styles.header}>
          <Text style={[styles.name, { color: theme.text }]}>{profile.user.name}</Text>
          <Text style={[styles.email, { color: theme.textMuted }]}>{profile.user.email}</Text>
        </View>

        {profile.bio && (
          <CVSection title="Giới thiệu">
            <Text style={[styles.bio, { color: theme.textMuted }]}>{profile.bio}</Text>
          </CVSection>
        )}
        
        {profile.skills && profile.skills.length > 0 && (
            <CVSection title="Kỹ năng">
                <View style={styles.skillsContainer}>
                    {profile.skills.map(skill => (
                        <View key={skill} style={[styles.skillTag, { backgroundColor: theme.surface, borderColor: theme.icon + '30' }]}>
                            <Text style={[styles.skillText, { color: theme.text }]}>{skill}</Text>
                        </View>
                    ))}
                </View>
            </CVSection>
        )}
        
        {profile.experience && profile.experience.length > 0 && (
            <CVSection title="Kinh nghiệm làm việc">
                {profile.experience.map((exp, index) => (
                    <CVTimelineItem
                        key={index}
                        title={exp.title}
                        subtitle={exp.company}
                        dateRange={`${formatDate(exp.from)} - ${formatDate(exp.to)}`}
                        description={exp.description}
                    />
                ))}
            </CVSection>
        )}
                
                {profile.projects && profile.projects.length > 0 && (
                    <CVSection title="Dự án nổi bật">
                        {profile.projects.map((proj, index) => (
                            <CVTimelineItem
                                key={index}
                                title={proj.name}
                                subtitle={proj.technologies.join(', ')}
                                description={proj.description}
                                dateRange="" // Không có ngày tháng cho dự án
                            />
                        ))}
                    </CVSection>
                )}

                {profile.education && profile.education.length > 0 && (
                    <CVSection title="Học vấn">
                        {profile.education.map((edu, index) => (
                            <CVTimelineItem
                                key={index}
                                title={edu.school}
                                subtitle={`${edu.degree} - ${edu.fieldOfStudy}`}
                                dateRange={`${formatDate(edu.from)} - ${formatDate(edu.to)}`}
                            />
                        ))}
                    </CVSection>
                )}
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