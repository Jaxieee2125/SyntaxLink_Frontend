import React from 'react';
import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Colors from '@/constants/Colors';
import CustomTabBar from '@/components/CustomTabBarUser';

export default function TabLayout() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  return (
    <>
      <StatusBar style="light" translucent />

      <Tabs
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerTransparent: true,
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: 'transparent',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          headerBackground: () => (
            <></>
          ),
          headerTintColor: theme.text,
          headerTitleStyle: { fontWeight: 'bold', fontSize: 22 },
        }}
      >
        <Tabs.Screen name="index" options={{ title: 'Bài tập' }} />
        <Tabs.Screen name="contests" options={{ title: 'Cuộc thi' }} />
        <Tabs.Screen name="jobs" options={{ title: 'Việc làm' }} />
        <Tabs.Screen name="profile" options={{ title: 'Hồ sơ' }} />
        <Tabs.Screen name="leaderboard" options={{ title: 'Bảng xếp hạng' }} />
      </Tabs>
    </>
  );
}
