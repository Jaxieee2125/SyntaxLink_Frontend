import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  useColorScheme,
  FlatList,
} from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import { LinearGradient } from "expo-linear-gradient";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";

import Colors from "@/constants/Colors";
import { createContest } from "@/api/contests";
import { getAllProblems } from "@/api/problems";
import { Problem } from "@/types/problem";
import { CreateContestPayload } from "@/types/contest";
import ScreenHeader from "@/components/ScreenHeader";
import { router } from "expo-router";

export default function CreateContestScreen() {
  const theme = Colors[useColorScheme() ?? "light"];
  const headerHeight = useHeaderHeight();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date(Date.now() + 3600000));

  const [problems, setProblems] = useState<Problem[]>([]);
  const [selectedProblems, setSelectedProblems] = useState<
    { problemId: string; alias: string }[]
  >([]);

  useEffect(() => {
    (async () => {
      const fetched = await getAllProblems();
      setProblems(fetched);
    })();
  }, []);

  const toggleProblem = (id: string) => {
    const exists = selectedProblems.find((p) => p.problemId === id);
    if (exists) {
      setSelectedProblems(selectedProblems.filter((p) => p.problemId !== id));
    } else {
      const alias = String.fromCharCode(65 + selectedProblems.length); // A, B, C...
      setSelectedProblems([...selectedProblems, { problemId: id, alias }]);
    }
  };

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

  const handleSubmit = async () => {
    if (!title || !description || selectedProblems.length === 0) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ và chọn bài toán");
      return;
    }

    const payload: CreateContestPayload = {
      title,
      description,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      problems: selectedProblems,
    };

    try {
      await createContest(payload);
      Alert.alert("Thành công", "Tạo cuộc thi thành công", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error("Error creating contest:", error);
      Alert.alert("Lỗi", "Không thể tạo cuộc thi");
    }
  };

  return (
    <LinearGradient
      colors={[
        theme.headerGradientStart,
        theme.headerGradientEnd,
        theme.background,
      ]}
      style={StyleSheet.absoluteFill}
    >
      <View style={{ paddingTop: headerHeight, paddingHorizontal: 16 }}>
        <ScreenHeader title="Tạo cuộc thi" subtitle="" />
        <View style={styles.form}>
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
              Bắt đầu: {startTime.toLocaleString()}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => showDateTimePicker(endTime, setEndTime)}
            style={[styles.input, { borderColor: theme.outline }]}
          >
            <Text style={{ color: theme.text }}>
              Kết thúc: {endTime.toLocaleString()}
            </Text>
          </TouchableOpacity>

          <Text style={{ color: theme.text, fontWeight: "600" }}>Chọn bài toán</Text>
          <FlatList
            data={problems}
            keyExtractor={(item) => item._id}
            style={{ maxHeight: 200 }}
            renderItem={({ item }) => {
              const selected = selectedProblems.find((p) => p.problemId === item._id);
              return (
                <TouchableOpacity
                  onPress={() => toggleProblem(item._id)}
                  style={[
                    styles.problemItem,
                    {
                      borderColor: selected ? theme.chipSelectedBorder : theme.outline,
                      backgroundColor: selected ? theme.chipSelectedBg : "transparent",
                    },
                  ]}
                >
                  <Text style={{ color: theme.text }}>
                    {selected ? `${selected.alias}. ` : ""}
                    {item.title}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />

          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.chipSelectedBg }]}
            onPress={handleSubmit}
          >
            <Text style={{ color: theme.chipSelectedText }}>Tạo cuộc thi</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  form: {
    marginTop: 16,
    gap: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
  },
  button: {
    marginTop: 20,
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
  },
  problemItem: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
});
