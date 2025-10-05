import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  useColorScheme,
  SafeAreaView,
  Alert,
  TouchableOpacity,
} from "react-native";
import { Stack, useNavigation, useRouter } from "expo-router";
import { DeveloperProfile } from "@/types/profile";
import { getMyProfile, downloadMyCv } from "@/api/profile";
import Colors from "@/constants/Colors";
import CVSection from "@/components/CVSection";
import CVTimelineItem from "@/components/CVTimelineItem";
import { Ionicons } from "@expo/vector-icons";
import * as Sharing from "expo-sharing";
import { useAuth } from "@/context/AuthContext";
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy'; // bạn đã dùng legacy
const { StorageAccessFramework } = FileSystem;

// Helper để format ngày tháng
const formatDate = (date: string | undefined) =>
  date
    ? new Date(date).toLocaleDateString("vi-VN", {
        month: "2-digit",
        year: "numeric",
      })
    : "Hiện tại";

export default function CVScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];
  const navigation = useNavigation();
  const router = useRouter();
  const { token, user } = useAuth();

  const [profile, setProfile] = useState<DeveloperProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  // Share
const handleShareCv = async () => {
  if (!token || !user) { Alert.alert('Lỗi', 'Không thể xác thực người dùng.'); return; }
  setIsDownloading(true);
  try {
    const fileUri = await downloadMyCv(token, user.name); // trả về file trong documentDirectory
    const ok = await Sharing.isAvailableAsync();
    if (!ok) { Alert.alert('Thông báo', 'Thiết bị không hỗ trợ Share. File đã được lưu tạm.'); return; }
    await Sharing.shareAsync(fileUri, { dialogTitle: 'Chia sẻ CV' });
  } catch (e) {
    console.error(e);
    Alert.alert('Lỗi', 'Không thể tải hoặc chia sẻ CV.');
  } finally {
    setIsDownloading(false);
  }
};

// Download về thư mục người dùng chọn (Android) hoặc Documents (iOS)
const handleDownloadCv = async () => {
  if (!token || !user) { Alert.alert('Lỗi', 'Không thể xác thực người dùng.'); return; }
  setIsDownloading(true);
  try {
    const srcUri = await downloadMyCv(token, user.name); // file ở app sandbox
    const fileName = `CV_${user.name.replace(/\s/g, '_')}.pdf`;

    if (Platform.OS === 'android') {
      // Hỏi quyền chọn thư mục đích bằng SAF
      const perm = await StorageAccessFramework.requestDirectoryPermissionsAsync();
      if (!perm.granted) { Alert.alert('Hủy', 'Bạn chưa chọn thư mục lưu.'); return; }

      // Tạo file đích và ghi dữ liệu
      const base64 = await FileSystem.readAsStringAsync(srcUri, { encoding: FileSystem.EncodingType.Base64 });
      const destUri = await StorageAccessFramework.createFileAsync(perm.directoryUri, fileName, 'application/pdf');
      await FileSystem.writeAsStringAsync(destUri, base64, { encoding: FileSystem.EncodingType.Base64 });

      Alert.alert('Đã lưu', 'CV đã được lưu vào thư mục bạn chọn.');
    } else {
      // iOS: lưu trong Documents của app
      const destUri = FileSystem.documentDirectory + fileName;
      await FileSystem.copyAsync({ from: srcUri, to: destUri });
      Alert.alert('Đã lưu', 'CV đã được lưu trong Files > On My iPhone > ứng dụng của bạn.');
    }
  } catch (e) {
    console.error(e);
    Alert.alert('Lỗi', 'Không thể tải hoặc lưu CV.');
  } finally {
    setIsDownloading(false);
  }
};

  // 🟢 Load profile, catch lỗi để không ném ra error
  useEffect(() => {
    (async () => {
      try {
        const data = await getMyProfile();
        setProfile(data); // có CV
      } catch (err: any) {
        console.log("Không có profile hoặc lỗi:", err?.error);
        setProfile(null); // không có CV
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // 🟢 Download + share CV
  const downloadAndShareCv = async () => {
    if (!token || !user) {
      Alert.alert("Lỗi", "Không thể xác thực người dùng.");
      return;
    }
    setIsDownloading(true);
    try {
      const fileUri = await downloadMyCv(token, user.name);
      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert("Lỗi", "Chức năng chia sẻ không khả dụng trên thiết bị này.");
        return;
      }
      await Sharing.shareAsync(fileUri, { dialogTitle: "Chia sẻ hoặc lưu CV của bạn" });
    } catch (error) {
      console.error("Download/Share CV Error:", error);
      Alert.alert("Lỗi", "Không thể tải CV từ server.");
    } finally {
      setIsDownloading(false);
    }
  };

  // 🟢 Header share button
// CVScreen.tsx (bổ sung handlers bên dưới trước)
useEffect(() => {
  if (!profile) { navigation.setOptions({ headerRight: () => null }); return; }

  navigation.setOptions({
    headerRight: () =>
      isDownloading ? (
        <ActivityIndicator style={{ marginRight: 12 }} color={theme.text} />
      ) : (
        <View style={{ flexDirection: 'row', gap: 16, marginRight: 12 }}>
          <TouchableOpacity onPress={handleDownloadCv}>
            <Ionicons name="download-outline" size={24} color={theme.text} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleShareCv}>
            <Ionicons name="share-outline" size={24} color={theme.text} />
          </TouchableOpacity>
        </View>
      ),
  });
}, [profile, isDownloading, navigation, theme]);


  // 🟢 Render
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  // 🟢 Không có CV → hiện nút tạo
  if (!profile) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: theme.background,
          justifyContent: "center",
          alignItems: "center",
          padding: 24,
        }}
      >
        <Text
          style={{
            fontSize: 18,
            color: theme.text,
            textAlign: "center",
            marginBottom: 20,
          }}
        >
          Bạn chưa có hồ sơ CV. Hãy tạo CV của bạn để giới thiệu bản thân với nhà tuyển dụng!
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/profile/edit")} // Đường dẫn tới trang edit CV
          style={{
            backgroundColor: Colors.primary,
            paddingVertical: 12,
            paddingHorizontal: 24,
            borderRadius: 10,
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
            Tạo CV ngay
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // 🟢 Có CV → render CV
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <Stack.Screen options={{ title: `CV của ${profile.user.name}` }} />
      <ScrollView contentContainerStyle={styles.container}>
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
              {profile.skills.map((skill) => (
                <View
                  key={skill}
                  style={[
                    styles.skillTag,
                    { backgroundColor: theme.surface, borderColor: theme.icon + "30" },
                  ]}
                >
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
                subtitle={proj.technologies.join(", ")}
                description={proj.description}
                dateRange=""
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
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: { paddingHorizontal: 24, paddingBottom: 40 },
  header: { alignItems: "center", marginBottom: 24, paddingTop: 20 },
  name: { fontSize: 28, fontWeight: "bold" },
  email: { fontSize: 16, marginTop: 4 },
  bio: { fontSize: 16, lineHeight: 24 },
  skillsContainer: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  skillTag: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  skillText: { fontSize: 14, fontWeight: "500" },
});
