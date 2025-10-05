// app/(admin)/users.tsx
import { useEffect, useState, useMemo } from "react";
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  useColorScheme,
} from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "@/constants/Colors";
import ScreenHeader from "@/components/ScreenHeader";
import { listUsers, updateUser, deleteUser } from "@/api/users";

type Role = "developer" | "employer" | "admin";

export default function UsersScreen() {
  const theme = Colors[useColorScheme() ?? "light"];
  const headerHeight = useHeaderHeight();
  const [users, setUsers] = useState<any[]>([]);
  const [q, setQ] = useState("");
  const [role, setRole] = useState<Role | "all">("all");

  const reload = async () => setUsers(await listUsers());
  useEffect(() => {
    reload().catch(() => {});
  }, []);

  const filtered = useMemo(() => {
    let data = users;
    if (role !== "all") data = data.filter((u) => u.role === role);
    if (q.trim()) {
      const s = q.toLowerCase();
      data = data.filter(
        (u) =>
          (u.name || "").toLowerCase().includes(s) ||
          (u.email || "").toLowerCase().includes(s)
      );
    }
    return data;
  }, [users, q, role]);

  const onChangeRole = async (id: string, next: Role) => {
    await updateUser(id, { role: next });
    await reload();
  };
  const onDelete = async (id: string) => {
    Alert.alert("Xóa người dùng", "Thao tác không thể hoàn tác.", [
      { text: "Hủy" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          await deleteUser(id);
          await reload();
        },
      },
    ]);
  };

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
        style={StyleSheet.absoluteFill}
      />
      <View
        style={{ flex: 1, paddingTop: headerHeight, paddingHorizontal: 16 }}
      >
        <ScreenHeader
          title="Người dùng"
          subtitle="Phân quyền và quản trị tài khoản"
        />
        <View style={{ marginBottom: 12 }}>
          {/* Ô tìm kiếm */}
          <TextInput
            placeholder="Tìm theo tên hoặc email"
            placeholderTextColor={theme.placeholder}
            value={q}
            onChangeText={setQ}
            style={{
              backgroundColor: theme.inputBg,
              color: theme.inputText,
              borderColor: theme.outline,
              borderWidth: 1,
              borderRadius: 12,
              paddingHorizontal: 12,
              height: 40,
            }}
          />

          {/* Bộ lọc Role bằng Chip */}
          <View
            style={{
              flexDirection: "row",
              gap: 8,
              flexWrap: "wrap",
              marginTop: 8,
            }}
          >
            {(["all", "developer", "employer", "admin"] as const).map((r) => {
              const selected = role === r;
              return (
                <TouchableOpacity
                  key={r}
                  onPress={() => setRole(r)}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: selected
                      ? theme.chipSelectedBorder
                      : theme.chipBorder,
                    backgroundColor: selected
                      ? theme.chipSelectedBg
                      : theme.chipBg,
                  }}
                >
                  <Text
                    style={{
                      color: selected ? theme.chipSelectedText : theme.chipText,
                    }}
                  >
                    {r === "all" ? "Tất cả" : r}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <FlatList
          data={filtered}
          keyExtractor={(u) => u._id}
          contentContainerStyle={{ paddingBottom: 120 }}
          renderItem={({ item }) => (
            <View
              style={[
                styles.row,
                {
                  borderColor: theme.outline,
                  backgroundColor: theme.background,
                },
              ]}
            >
              <View style={{ flex: 1 }}>
                <Text style={{ color: theme.text, fontWeight: "600" }}>
                  {item.name}
                </Text>
                <Text style={{ color: theme.textMuted, fontSize: 12 }}>
                  {item.email}
                </Text>
                <Text style={{ color: theme.textMuted, fontSize: 12 }}>
                  Role: {item.role}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() =>
                  onChangeRole(
                    item._id,
                    item.role === "developer"
                      ? "employer"
                      : item.role === "employer"
                      ? "admin"
                      : "developer"
                  )
                }
                style={[
                  styles.btn,
                  {
                    borderColor: theme.chipBorder,
                    backgroundColor: theme.chipBg,
                  },
                ]}
              >
                <Text style={{ color: theme.chipText }}>Đổi role</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => onDelete(item._id)}
                style={[
                  styles.btn,
                  {
                    borderColor: theme.chipSelectedBorder,
                    backgroundColor: theme.chipSelectedBg,
                  },
                ]}
              >
                <Text style={{ color: theme.chipSelectedText }}>Xóa</Text>
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
    gap: 8,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    marginBottom: 10,
  },
  btn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
  },
});
