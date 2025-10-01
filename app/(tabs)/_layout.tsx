import React from 'react';
import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Colors from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

function TabBarIcon(props: { name: React.ComponentProps<typeof FontAwesome>['name']; color: string }) {
  return <FontAwesome size={24} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  return (
    <>
      {/* Tự động điều chỉnh màu chữ trên thanh trạng thái (pin, sóng) */}
      <StatusBar style="auto" /> 
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: theme.tint,
          tabBarStyle: {
            backgroundColor: theme.surface,
            borderTopColor: theme.surface,
          },
          headerShown: true,
          
          // ==========================================================
          // SỬ DỤNG MÀU GRADIENT MỚI, RÕ RÀNG HƠN
          // ==========================================================
          headerBackground: () => (
            <LinearGradient
              // Lấy màu từ theme đã được định nghĩa ở bước 1
              colors={[theme.headerGradientStart, theme.headerGradientEnd]}
              style={{ flex: 1 }}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }} // Chuyển màu từ trên xuống dưới
            />
          ),
          // Bỏ headerStyle để tránh xung đột với headerBackground
          headerTintColor: theme.text,
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 22,
          },
          headerShadowVisible: false, // Bỏ shadow mặc định
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Bài tập',
            tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          }}
        />
        <Tabs.Screen
          name="contests"
          options={{
            title: 'Cuộc thi',
            tabBarIcon: ({ color }) => <TabBarIcon name="trophy" color={color} />,
          }}
        />
        <Tabs.Screen
          name="jobs"
          options={{
            title: 'Việc làm',
            tabBarIcon: ({ color }) => <TabBarIcon name="briefcase" color={color} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Hồ sơ',
            tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
          }}
        />
      </Tabs>
    </>
  );
}