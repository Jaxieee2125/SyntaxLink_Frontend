// components/ProblemForm.tsx
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Switch,
} from "react-native";
import Colors from "@/constants/Colors";
import { useColorScheme } from "react-native";

// ==== Types riêng cho tạo bài toán ====
export type Difficulty = "Easy" | "Medium" | "Hard";
export interface TestCaseDto {
  input: string;
  expectedOutput: string;
  isSample: boolean;
}
export interface CreateProblemDto {
  title: string;
  description: string;
  difficulty: Difficulty;
  timeLimit: number;    // seconds
  memoryLimit: number;  // MB
  testCases: TestCaseDto[];
}

interface Props {
  initialData?: Partial<CreateProblemDto>;
  onSubmit: (data: CreateProblemDto) => Promise<void>;
  submitLabel?: string;
}

// style helper (KHÔNG đặt trong StyleSheet.create)
const inputCommon = (theme: any) => ({
  backgroundColor: theme.inputBg,
  color: theme.inputText,
  borderColor: theme.outline,
});

export default function ProblemForm({
  initialData = {},
  onSubmit,
  submitLabel = "Lưu",
}: Props) {
  const theme = Colors[useColorScheme() ?? "light"];

  const [title, setTitle] = useState<string>(initialData.title ?? "");
  const [description, setDescription] = useState<string>(initialData.description ?? "");
  const [difficulty, setDifficulty] = useState<Difficulty>(initialData.difficulty ?? "Easy");
  const [timeLimit, setTimeLimit] = useState<string>(
    initialData.timeLimit !== undefined ? String(initialData.timeLimit) : "1"
  );
  const [memoryLimit, setMemoryLimit] = useState<string>(
    initialData.memoryLimit !== undefined ? String(initialData.memoryLimit) : "256"
  );
  const [testCases, setTestCases] = useState<TestCaseDto[]>(
    Array.isArray(initialData.testCases) && initialData.testCases.length
      ? (initialData.testCases as TestCaseDto[])
      : [{ input: "", expectedOutput: "", isSample: false }]
  );
  const [loading, setLoading] = useState(false);

  const updateTestCase = (index: number, field: keyof TestCaseDto, value: string | boolean) => {
    setTestCases((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value } as TestCaseDto;
      return next;
    });
  };

  const addTestCase = () =>
    setTestCases((prev) => [...prev, { input: "", expectedOutput: "", isSample: false }]);

  const removeTestCase = (index: number) =>
    setTestCases((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập tiêu đề và mô tả.");
      return;
    }
    const tl = Number(timeLimit);
    const ml = Number(memoryLimit);
    if (!Number.isFinite(tl) || tl <= 0) {
      Alert.alert("Sai dữ liệu", "Time Limit phải là số > 0.");
      return;
    }
    if (!Number.isFinite(ml) || ml <= 0) {
      Alert.alert("Sai dữ liệu", "Memory Limit phải là số > 0.");
      return;
    }
    if (!testCases.length || testCases.some(tc => !tc.input.trim() || !tc.expectedOutput.trim())) {
      Alert.alert("Thiếu test case", "Mỗi test case cần có Input và Expected Output.");
      return;
    }

    try {
      setLoading(true);
      const payload: CreateProblemDto = {
        title: title.trim(),
        description: description.trim(),
        difficulty,
        timeLimit: tl,
        memoryLimit: ml,
        testCases,
      };
      await onSubmit(payload);
    } catch (err) {
      console.error("Submit failed:", err);
      Alert.alert("Lỗi", "Không thể lưu bài toán.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ gap: 20 }}>
      {/* Tiêu đề */}
      <View>
        <Text style={[styles.label, { color: theme.text }]}>Tiêu đề</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Nhập tiêu đề bài toán"
          placeholderTextColor={theme.placeholder}
          style={[styles.input, inputCommon(theme)]}
        />
      </View>

      {/* Mô tả */}
      <View>
        <Text style={[styles.label, { color: theme.text }]}>Mô tả</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Nhập mô tả bài toán"
          placeholderTextColor={theme.placeholder}
          multiline
          numberOfLines={4}
          style={[styles.textarea, inputCommon(theme)]}
        />
      </View>

      {/* Độ khó */}
      <View>
        <Text style={[styles.label, { color: theme.text }]}>Độ khó</Text>
        <View style={{ flexDirection: "row", gap: 8 }}>
          {(["easy", "medium", "hard"] as const).map((d: "easy" | "medium" | "hard") => {
            const selected = difficulty.toLowerCase() === d;
            return (
              <TouchableOpacity
                key={d}
                onPress={() =>
                  setDifficulty((d.charAt(0).toUpperCase() + d.slice(1)) as Difficulty)
                }
                style={[
                  styles.difficultyChip,
                  {
                    backgroundColor: selected ? theme.chipSelectedBg : theme.chipBg,
                    borderColor: selected ? theme.chipSelectedBorder : theme.chipBorder,
                  },
                ]}
              >
                <Text
                  style={{
                    color: selected ? theme.chipSelectedText : theme.chipText,
                    fontWeight: selected ? "600" : "400",
                  }}
                >
                  {d}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Time & Memory */}
      <View style={{ flexDirection: "row", gap: 12 }}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.label, { color: theme.text }]}>Time Limit (s)</Text>
          <TextInput
            keyboardType="numeric"
            value={timeLimit}
            onChangeText={setTimeLimit}
            style={[styles.input, inputCommon(theme)]}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.label, { color: theme.text }]}>Memory Limit (MB)</Text>
          <TextInput
            keyboardType="numeric"
            value={memoryLimit}
            onChangeText={setMemoryLimit}
            style={[styles.input, inputCommon(theme)]}
          />
        </View>
      </View>

      {/* Test Cases */}
      <View>
        <Text style={[styles.label, { color: theme.text }]}>Test Cases</Text>
        {testCases.map((tc: TestCaseDto, i: number) => (
          <View
            key={i}
            style={{
              padding: 12,
              borderWidth: 1,
              borderRadius: 10,
              marginBottom: 10,
              borderColor: theme.outline,
              backgroundColor: theme.surface ?? theme.inputBg,
            }}
          >
            <Text style={{ color: theme.text, marginBottom: 6 }}>Input</Text>
            <TextInput
              value={tc.input}
              onChangeText={(t) => updateTestCase(i, "input", t)}
              multiline
              style={[styles.textarea, inputCommon(theme)]}
            />

            <Text style={{ color: theme.text, marginTop: 10, marginBottom: 6 }}>
              Expected Output
            </Text>
            <TextInput
              value={tc.expectedOutput}
              onChangeText={(t) => updateTestCase(i, "expectedOutput", t)}
              multiline
              style={[styles.textarea, inputCommon(theme)]}
            />

            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 8 }}>
              <Switch
                value={tc.isSample}
                onValueChange={(v) => updateTestCase(i, "isSample", v)}
              />
              <Text style={{ marginLeft: 8, color: theme.text }}>Sample</Text>

              {testCases.length > 1 && (
                <TouchableOpacity onPress={() => removeTestCase(i)} style={{ marginLeft: "auto" }}>
                  <Text style={{ color: "#ff4d4f", fontWeight: "600" }}>Xoá</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}

        <TouchableOpacity onPress={addTestCase}>
          <Text style={{ color: theme.text, textDecorationLine: "underline" }}>
            ➕ Thêm test case
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={handleSubmit}
        disabled={loading}
        style={{
          backgroundColor: theme.chipSelectedBg,
          padding: 14,
          borderRadius: 16,
          alignItems: "center",
          marginTop: 8,
        }}
      >
        <Text style={{ color: theme.chipSelectedText, fontWeight: "bold" }}>
          {submitLabel}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  label: { marginBottom: 6, fontWeight: "600", fontSize: 14 },
  input: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, height: 42, fontSize: 14 },
  textarea: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    minHeight: 80,
    fontSize: 14,
    textAlignVertical: "top",
  },
  difficultyChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
});
