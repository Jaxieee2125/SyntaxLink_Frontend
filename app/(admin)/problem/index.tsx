import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  useColorScheme,
} from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import Colors from "@/constants/Colors";
import ScreenHeader from "@/components/ScreenHeader";
import { getAllProblems, deleteProblem } from "@/api/problems";
import { Problem } from "@/types/problem";

export default function ProblemsScreen() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const theme = Colors[useColorScheme() ?? "light"];
  const headerHeight = useHeaderHeight();
  const router = useRouter();

  const load = async () => {
    const data = await getAllProblems();
    setProblems(data);
  };

  const onDelete = async (id: string) => {
    Alert.alert("Xoá bài toán", "Bạn có chắc chắn?", [
      { text: "Huỷ" },
      {
        text: "Xoá",
        style: "destructive",
        onPress: async () => {
          await deleteProblem(id);
          await load();
        },
      },
    ]);
  };

  useEffect(() => {
    load().catch(() => {});
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={[
          theme.headerGradientStart,
          theme.headerGradientEnd,
          theme.background,
        ]}
        locations={[0, 0.18, 1]}
        style={StyleSheet.absoluteFill}
      />
      <View
        style={{ flex: 1, paddingTop: headerHeight, paddingHorizontal: 16 }}
      >
        <ScreenHeader title="Bài toán" subtitle="Danh sách bài toán hệ thống" />
        <TouchableOpacity
          onPress={() => router.push("/problem/create")}
          style={[styles.btn, { backgroundColor: theme.chipSelectedBg }]}
        >
          <Text style={{ color: theme.chipSelectedText }}>+ Thêm bài toán</Text>
        </TouchableOpacity>

        <FlatList
          data={problems}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingBottom: 120 }}
          renderItem={({ item }) => (
            <View style={[styles.row, { borderColor: theme.outline }]}>
              <View style={{ flex: 1 }}>
                <Text style={{ color: theme.text, fontWeight: "600" }}>
                  {item.title}
                </Text>
                <Text style={{ color: theme.textMuted }}>
                  Độ khó: {item.difficulty}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => router.push(`/problem/edit/${item._id}`)}
                style={[
                  styles.smallBtn,
                  { backgroundColor: theme.buttonPrimaryBg },
                ]}
              >
                <Text style={{ color: theme.buttonPrimaryText }}>Sửa</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => onDelete(item._id)}
                style={[
                  styles.smallBtn,
                  { backgroundColor: theme.buttonDangerBg },
                ]}
              >
                <Text style={{ color: theme.buttonDangerText }}>Xoá</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    padding: 12,
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 10,
    alignItems: "center",
    gap: 8,
  },
  btn: {
    alignSelf: "flex-start",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  smallBtn: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "#eee",
  },
});
