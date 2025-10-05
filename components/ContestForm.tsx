import { useEffect, useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  Alert,
} from "react-native";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import Colors from "@/constants/Colors";
import { getAllProblems } from "@/api/problems";
import { Problem } from "@/types/problem";

interface Props {
  initial?: {
    title: string;
    description: string;
    startTime: Date;
    endTime: Date;
    problems: {
      problemId: string;
      alias: string;
    }[];
  };
  onSubmit: (values: {
    title: string;
    description: string;
    startTime: Date;
    endTime: Date;
    problems: {
      problemId: string;
      alias: string;
    }[];
  }) => void;
  submitLabel?: string;
}

export default function ContestForm({ initial, onSubmit, submitLabel = "Tạo" }: Props) {
  const theme = Colors[useColorScheme() ?? "light"];
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [startTime, setStartTime] = useState<Date>(initial?.startTime ?? new Date());
  const [endTime, setEndTime] = useState<Date>(initial?.endTime ?? new Date());
  const [allProblems, setAllProblems] = useState<Problem[]>([]);
  const [selectedProblems, setSelectedProblems] = useState<
    { problemId: string; alias: string }[]
  >(initial?.problems ?? []);

  const loadProblems = async () => {
    try {
      const res = await getAllProblems();
      setAllProblems(res);
    } catch (err) {
      Alert.alert("Lỗi", "Không thể tải danh sách bài toán");
    }
  };

  useEffect(() => {
    loadProblems();
  }, []);

  const showDateTimePicker = (
    current: Date,
    onChange: (date: Date) => void
  ) => {
    DateTimePickerAndroid.open({
      value: current,
      mode: "date",
      is24Hour: true,
      onChange: (_e, date) => {
        if (date) {
          DateTimePickerAndroid.open({
            value: new Date(date),
            mode: "time",
            is24Hour: true,
            onChange: (_e, time) => {
              if (time) {
                const combined = new Date(
                  date.getFullYear(),
                  date.getMonth(),
                  date.getDate(),
                  time.getHours(),
                  time.getMinutes()
                );
                onChange(combined);
              }
            },
          });
        }
      },
    });
  };

  const toggleProblem = (problemId: string) => {
    const exists = selectedProblems.find((p) => p.problemId === problemId);
    if (exists) {
      setSelectedProblems((prev) => prev.filter((p) => p.problemId !== problemId));
    } else {
      const nextAlias = String.fromCharCode(65 + selectedProblems.length); // A, B, C...
      setSelectedProblems((prev) => [...prev, { problemId, alias: nextAlias }]);
    }
  };

  const handleSubmit = () => {
    if (!title || !description || selectedProblems.length === 0) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin và chọn ít nhất 1 bài toán");
      return;
    }

    onSubmit({
      title,
      description,
      startTime,
      endTime,
      problems: selectedProblems,
    });
  };

  return (
    <View style={{ gap: 14 }}>
      <TextInput
        placeholder="Tiêu đề"
        placeholderTextColor={theme.placeholder}
        style={[styles.input, { color: theme.text, borderColor: theme.outline }]}
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        placeholder="Mô tả"
        placeholderTextColor={theme.placeholder}
        style={[styles.input, { color: theme.text, borderColor: theme.outline }]}
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <TouchableOpacity
        onPress={() => showDateTimePicker(startTime, setStartTime)}
        style={[styles.input, { borderColor: theme.outline }]}
      >
        <Text style={{ color: theme.text }}>
          {startTime.toLocaleString()}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => showDateTimePicker(endTime, setEndTime)}
        style={[styles.input, { borderColor: theme.outline }]}
      >
        <Text style={{ color: theme.text }}>
          {endTime.toLocaleString()}
        </Text>
      </TouchableOpacity>

      <Text style={{ color: theme.text, fontWeight: "bold" }}>
        Chọn bài toán:
      </Text>
      <View style={{ gap: 8 }}>
        {allProblems.map((problem, index) => {
          const isSelected = selectedProblems.some((p) => p.problemId === problem._id);
          return (
            <TouchableOpacity
              key={problem._id}
              onPress={() => toggleProblem(problem._id)}
              style={{
                padding: 10,
                borderRadius: 8,
                backgroundColor: isSelected ? theme.chipSelectedBg : theme.chipBg,
              }}
            >
              <Text
                style={{
                  color: isSelected ? theme.chipSelectedText : theme.chipText,
                }}
              >
                {problem.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.buttonPrimaryBg }]}
        onPress={handleSubmit}
      >
        <Text style={{ color: theme.buttonPrimaryText, fontWeight: "bold" }}>
          {submitLabel}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
  },
  button: {
    alignItems: "center",
    padding: 14,
    borderRadius: 8,
    marginTop: 20,
  },
});
