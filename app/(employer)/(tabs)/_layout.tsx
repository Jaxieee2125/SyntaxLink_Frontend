// app/(employer)/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import { useColorScheme } from "react-native";
import Colors from "@/constants/Colors";
import CustomTabBarEmployer from "@/components/CustomTabBarEmployer";

export default function EmployerTabsLayout() {
  const theme = Colors[useColorScheme() ?? "light"];

  return (
    <Tabs
      tabBar={(p) => <CustomTabBarEmployer {...p} />}
      screenOptions={{
        headerTransparent: true,
        headerShadowVisible: false,
        headerTintColor: theme.text,
        headerTitleStyle: { fontWeight: "bold", fontSize: 22 },
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Công việc" }} />
      <Tabs.Screen name="contest" options={{ title: "Cuộc thi" }} />
    </Tabs>
  );
}
