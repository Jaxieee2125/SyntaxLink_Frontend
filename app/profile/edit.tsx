import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Alert, useColorScheme, ActivityIndicator, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { Stack, router } from 'expo-router';
import { getMyProfile, updateMyProfile } from '@/api/profile';
import { EditableProfile, WorkExperience, Education, Project } from '@/types/profile';
import StyledButton from '@/components/StyledButton';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';

// Định nghĩa các object rỗng để thêm mục mới
const newExperienceItem: WorkExperience = { title: '', company: '', from: '', to: '' };
const newEducationItem: Education = { school: '', degree: '', fieldOfStudy: '', from: '', to: '' };
const newProjectItem: Project = { name: '', description: '', technologies: [] };

export default function EditProfileScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  // State cho các trường đơn giản
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState('');
  const [social, setSocial] = useState({ github: '', linkedin: '', website: '' });
  
  // State mới: Dùng mảng để quản lý danh sách
  const [experience, setExperience] = useState<WorkExperience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    getMyProfile()
      .then(data => {
        setBio(data.bio || '');
        setSkills(data.skills?.join(', ') || '');
        setSocial({
          github: data.social?.github || '',
          linkedin: data.social?.linkedin || '',
          website: data.social?.website || '',
        });
        setExperience(data.experience || []);
        setEducation(data.education || []);
        setProjects(data.projects || []);
      })
      .catch(() => {
        // Nếu chưa có profile, các mảng sẽ là mảng rỗng
        console.log("No profile found, starting fresh.");
      })
      .finally(() => setIsLoading(false));
  }, []);

  // === CÁC HÀM HELPER ĐỂ CẬP NHẬT MẢNG STATE ===
  const handleItemChange = <T, K extends keyof T>(
    index: number, 
    field: K, 
    value: T[K], 
    setter: React.Dispatch<React.SetStateAction<T[]>>
  ) => {
    setter(currentItems => {
      const newItems = [...currentItems];
      newItems[index] = { ...newItems[index], [field]: value };
      return newItems;
    });
  };
  
  const addItem = <T,>(newItem: T, setter: React.Dispatch<React.SetStateAction<T[]>>) => {
      setter(currentItems => [...currentItems, newItem]);
  };

  const removeItem = <T,>(index: number, setter: React.Dispatch<React.SetStateAction<T[]>>) => {
    setter(currentItems => currentItems.filter((_, i) => i !== index));
  };


  const handleSave = async () => {
    setIsSaving(true);
    try {
      const skillsArray = skills.split(',').map(s => s.trim()).filter(Boolean);
      
      const profileData: EditableProfile = {
          bio,
          skills: skillsArray,
          social,
          experience,
          education,
          projects,
      };
      
      await updateMyProfile(profileData);
      Alert.alert('Thành công', 'Hồ sơ của bạn đã được cập nhật.');
      router.back();
    } catch (error: any) {
      Alert.alert('Lỗi', error.error || 'Không thể cập nhật hồ sơ.');
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return <View style={styles.centered}><ActivityIndicator size="large" color={Colors.primary} /></View>;
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
        <Stack.Screen options={{ title: 'Chỉnh sửa Hồ sơ' }} />

        {/* --- Bio, Skills, Social --- */}
        {/* --- Bio, Skills, Social --- */}
        <InputSection title="Giới thiệu">
          <TextInput
            style={[styles.input, styles.textArea, { color: theme.text, borderColor: theme.icon + '50' }]}
            value={bio}
            onChangeText={setBio}
            placeholder="Một vài dòng về bạn..."
            placeholderTextColor={theme.textMuted}
            multiline
          />
        </InputSection>
        
        <InputSection title="Kỹ năng">
          <TextInput
            style={[styles.input, { color: theme.text, borderColor: theme.icon + '50' }]}
            value={skills}
            onChangeText={setSkills}
            placeholder="Node.js, React, TypeScript,..."
            placeholderTextColor={theme.textMuted}
          />
          <Text style={[styles.helperText, { color: theme.textMuted }]}>
            Các kỹ năng phân tách bằng dấu phẩy ","
          </Text>
        </InputSection>

        <InputSection title="Liên kết mạng xã hội">
          <TextInput
            style={[styles.input, { color: theme.text, borderColor: theme.icon + '50' }]}
            value={social.github}
            onChangeText={text => setSocial(s => ({...s, github: text}))}
            placeholder="Link GitHub"
            placeholderTextColor={theme.textMuted}
          />
          <TextInput
            style={[styles.input, { color: theme.text, borderColor: theme.icon + '50' }]}
            value={social.linkedin}
            onChangeText={text => setSocial(s => ({...s, linkedin: text}))}
            placeholder="Link LinkedIn"
            placeholderTextColor={theme.textMuted}
          />
          <TextInput
            style={[styles.input, { color: theme.text, borderColor: theme.icon + '50' }]}
            value={social.website}
            onChangeText={text => setSocial(s => ({...s, website: text}))}
            placeholder="Link Website/Portfolio"
            placeholderTextColor={theme.textMuted}
          />
        </InputSection>
        
        {/* --- KINH NGHIỆM LÀM VIỆC --- */}
        <InputSection title="Kinh nghiệm làm việc">
          {experience.map((exp, index) => (
            <View key={index} style={[styles.itemContainer, { borderColor: theme.icon + '30' }]}>
              <TouchableOpacity style={styles.removeButton} onPress={() => removeItem(index, setExperience)}>
                <Ionicons name="trash-outline" size={20} color={Colors.danger} />
              </TouchableOpacity>
              <TextInput
                style={[styles.input, { color: theme.text, borderColor: theme.icon + '50' }]}
                value={exp.title}
                onChangeText={text => handleItemChange(index, 'title', text, setExperience)}
                placeholder="Chức danh"
                placeholderTextColor={theme.textMuted}
              />
              <TextInput
                style={[styles.input, { color: theme.text, borderColor: theme.icon + '50' }]}
                value={exp.company}
                onChangeText={text => handleItemChange(index, 'company', text, setExperience)}
                placeholder="Tên công ty"
                placeholderTextColor={theme.textMuted}
              />
            </View>
          ))}
          <TouchableOpacity style={styles.addButton} onPress={() => addItem(newExperienceItem, setExperience)}>
            <Ionicons name="add-circle-outline" size={24} color={Colors.primary} />
            <Text style={[styles.addButtonText, { color: Colors.primary }]}>Thêm kinh nghiệm</Text>
          </TouchableOpacity>
        </InputSection>
        
        {/* --- DỰ ÁN NỔI BẬT --- */}
        <InputSection title="Dự án nổi bật">
            {projects.map((proj, index) => (
                <View key={index} style={[styles.itemContainer, { borderColor: theme.icon + '30' }]}>
                    <TouchableOpacity style={styles.removeButton} onPress={() => removeItem(index, setProjects)}>
                        <Ionicons name="trash-outline" size={20} color={Colors.danger} />
                    </TouchableOpacity>
                    <TextInput
                      style={[styles.input, { color: theme.text, borderColor: theme.icon + '50' }]}
                      value={proj.name}
                      onChangeText={text => handleItemChange(index, 'name', text, setProjects)}
                      placeholder="Tên dự án"
                      placeholderTextColor={theme.textMuted}
                    />
                    <TextInput
                      style={[styles.input, styles.textArea, { color: theme.text, borderColor: theme.icon + '50' }]}
                      value={proj.description}
                      onChangeText={text => handleItemChange(index, 'description', text, setProjects)}
                      placeholder="Mô tả dự án"
                      placeholderTextColor={theme.textMuted}
                      multiline
                    />
                </View>
            ))}
            <TouchableOpacity style={styles.addButton} onPress={() => addItem(newProjectItem, setProjects)}>
                <Ionicons name="add-circle-outline" size={24} color={Colors.primary} />
                <Text style={[styles.addButtonText, { color: Colors.primary }]}>Thêm dự án</Text>
            </TouchableOpacity>
        </InputSection>
        
        {/* --- HỌC VẤN --- */}
        <InputSection title="Học vấn">
            {education.map((edu, index) => (
                <View key={index} style={[styles.itemContainer, { borderColor: theme.icon + '30' }]}>
                    <TouchableOpacity style={styles.removeButton} onPress={() => removeItem(index, setEducation)}>
                        <Ionicons name="trash-outline" size={20} color={Colors.danger} />
                    </TouchableOpacity>
                    <TextInput
                      style={[styles.input, { color: theme.text, borderColor: theme.icon + '50' }]}
                      value={edu.school}
                      onChangeText={text => handleItemChange(index, 'school', text, setEducation)}
                      placeholder="Tên trường học"
                      placeholderTextColor={theme.textMuted}
                    />
                    <TextInput
                      style={[styles.input, { color: theme.text, borderColor: theme.icon + '50' }]}
                      value={edu.degree}
                      onChangeText={text => handleItemChange(index, 'degree', text, setEducation)}
                      placeholder="Bằng cấp"
                      placeholderTextColor={theme.textMuted}
                    />
                    <TextInput
                      style={[styles.input, { color: theme.text, borderColor: theme.icon + '50' }]}
                      value={edu.fieldOfStudy}
                      onChangeText={text => handleItemChange(index, 'fieldOfStudy', text, setEducation)}
                      placeholder="Chuyên ngành"
                      placeholderTextColor={theme.textMuted}
                    />
                </View>
            ))}
            <TouchableOpacity style={styles.addButton} onPress={() => addItem(newEducationItem, setEducation)}>
                <Ionicons name="add-circle-outline" size={24} color={Colors.primary} />
                <Text style={[styles.addButtonText, { color: Colors.primary }]}>Thêm học vấn</Text>
            </TouchableOpacity>
        </InputSection>

        <View style={styles.buttonContainer}>
          <StyledButton title="Lưu thay đổi" onPress={handleSave} isLoading={isSaving} />
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const InputSection = ({ title, children }: { title: string, children: React.ReactNode }) => {
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];

    // Thêm lệnh 'return' còn thiếu
    return (
        <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>{title}</Text>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { flex: 1, padding: 20 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 12,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top'
  },
  helperText: {
      fontSize: 13,
      opacity: 0.8,
      marginTop: -8,
      marginBottom: 12,
  },
  buttonContainer: {
      marginTop: 20,
  },
  itemContainer: {
      borderWidth: 1,
      borderRadius: 12,
      padding: 16,
      paddingTop: 30, // Chừa không gian cho nút xóa
      marginBottom: 16,
      position: 'relative',
  },
  addButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
      justifyContent: 'center',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: Colors.primary,
      borderStyle: 'dashed',
  },
  addButtonText: {
      marginLeft: 8,
      fontSize: 16,
      fontWeight: 'bold',
  },
  removeButton: {
      position: 'absolute',
      top: 8,
      right: 8,
  }
});