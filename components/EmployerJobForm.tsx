import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';

type FormValue = {
  title: string;
  description: string;
  requirements: string[]; // parse từ input text
  salaryRange?: string;
  location: string;
};

export default function EmployerJobForm({
  initial,
  onSubmit,
  submitLabel = 'Lưu',
}: {
  initial?: Partial<FormValue>;
  onSubmit: (v: FormValue) => Promise<void>;
  submitLabel?: string;
}) {
  const theme = Colors[useColorScheme() ?? 'light'];
  const [title, setTitle] = useState(initial?.title ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [reqText, setReqText] = useState(
    (initial?.requirements ?? []).join('\n')
  );
  const [salaryRange, setSalaryRange] = useState(initial?.salaryRange ?? '');
  const [location, setLocation] = useState(initial?.location ?? '');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!title.trim() || !description.trim() || !location.trim()) {
      Alert.alert('Thiếu dữ liệu', 'Tiêu đề, mô tả, địa điểm là bắt buộc.');
      return;
    }
    const requirements = reqText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);
    try {
      setLoading(true);
      await onSubmit({ title: title.trim(), description: description.trim(), requirements, salaryRange: salaryRange?.trim(), location: location.trim() });
    } catch (e) {
      Alert.alert('Lỗi', 'Không thể lưu công việc.');
    } finally {
      setLoading(false);
    }
  };

  const base = {
    borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10,
    backgroundColor: theme.inputBg, color: theme.inputText, borderColor: theme.outline,
  };

  return (
    <View style={{ gap: 12 }}>
      <View>
        <Text style={{ color: theme.text, marginBottom: 6, fontWeight: '600' }}>Tiêu đề</Text>
        <TextInput value={title} onChangeText={setTitle} style={base} placeholder="Ví dụ: Senior Backend Developer" placeholderTextColor={theme.placeholder} />
      </View>

      <View>
        <Text style={{ color: theme.text, marginBottom: 6, fontWeight: '600' }}>Mô tả</Text>
        <TextInput value={description} onChangeText={setDescription} multiline numberOfLines={5}
          style={[base, { minHeight: 100, textAlignVertical: 'top' }]} placeholder="Mô tả công việc..." placeholderTextColor={theme.placeholder} />
      </View>

      <View>
        <Text style={{ color: theme.text, marginBottom: 6, fontWeight: '600' }}>Yêu cầu (mỗi dòng một mục)</Text>
        <TextInput value={reqText} onChangeText={setReqText} multiline numberOfLines={5}
          style={[base, { minHeight: 120, textAlignVertical: 'top' }]} placeholder="Node.js\nTypeScript\nMongoDB" placeholderTextColor={theme.placeholder} />
      </View>

      <View style={{ flexDirection: 'row', gap: 12 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ color: theme.text, marginBottom: 6, fontWeight: '600' }}>Mức lương</Text>
          <TextInput value={salaryRange} onChangeText={setSalaryRange} style={base} placeholder="VD: $2000 - $3000" placeholderTextColor={theme.placeholder} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ color: theme.text, marginBottom: 6, fontWeight: '600' }}>Địa điểm</Text>
          <TextInput value={location} onChangeText={setLocation} style={base} placeholder="Hanoi / HCMC" placeholderTextColor={theme.placeholder} />
        </View>
      </View>

      <TouchableOpacity disabled={loading} onPress={submit}
        style={{ backgroundColor: theme.buttonPrimaryBg, padding: 14, borderRadius: 14, alignItems: 'center', marginTop: 4 }}>
        <Text style={{ color: theme.buttonPrimaryText, fontWeight: '700' }}>{submitLabel}</Text>
      </TouchableOpacity>
    </View>
  );
}
