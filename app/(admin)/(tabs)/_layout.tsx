// app/(admin)/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import { useColorScheme } from "react-native";
import Colors from "@/constants/Colors";
import CustomTabBarAdmin from "@/components/CustomTabBarAdmin";

export default function AdminTabsLayout() {
  const theme = Colors[useColorScheme() ?? "light"];

  return (
    <Tabs
      tabBar={(p) => <CustomTabBarAdmin {...p} />}
      screenOptions={{
        headerTransparent: true,
        headerShadowVisible: false,
        headerTintColor: theme.text,
        headerTitleStyle: { fontWeight: "bold", fontSize: 22 },
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Dashboard" }} />
      <Tabs.Screen name="users" options={{ title: "Người dùng" }} />
      <Tabs.Screen name="problem" options={{ title: "Bài toán" }} />
      <Tabs.Screen name="job" options={{ title: "Công việc" }} />
    </Tabs>
  );
}
