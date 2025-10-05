import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColorScheme } from "react-native";
import Colors from "@/constants/Colors";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CIRCLE_SIZE = 56;

const icons: Record<string, React.ComponentProps<typeof FontAwesome>["name"]> = {
  index: "briefcase",
  contest: "trophy",
};

const labels: Record<string, string> = {
  index: "Công việc",
  contest: "Cuộc thi",
};

export default function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];
  const tabCount = state.routes.length;

  const circleTranslateX = useRef(
    new Animated.Value((SCREEN_WIDTH / tabCount) * state.index)
  ).current;

  useEffect(() => {
    console.log("routes in tab bar", state.routes.map(r => r.name));
    Animated.spring(circleTranslateX, {
      toValue: (SCREEN_WIDTH / tabCount) * state.index,
      useNativeDriver: true,
      bounciness: 10,
      speed: 20,
    }).start();
  }, [state.index]);

  return (
    <View style={styles.container}>
      {/* HÌNH TRÒN NỔI */}
      <Animated.View
        style={[
          styles.floatingCircle,
          {
            backgroundColor: theme.headerGradientStart,
            transform: [{ translateX: circleTranslateX }],
            left: SCREEN_WIDTH / tabCount / 2 - CIRCLE_SIZE / 2,
          },
        ]}
      >
        <FontAwesome
          name={icons[state.routes[state.index].name]}
          size={24}
          color="#fff"
        />
      </Animated.View>

      {/* TAB BAR */}
      <View
        style={[
          styles.tabBar,
          {
            backgroundColor: theme.surface,
            paddingBottom: insets.bottom + 12,
          },
        ]}
      >
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const onPress = () => navigation.navigate(route.name as never);

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              activeOpacity={0.8}
              style={[
                styles.tabItem,
                {
                  paddingTop: isFocused ? CIRCLE_SIZE / 2 + 6 : 12,
                },
              ]}
            >
              {isFocused ? (
                <Text style={[styles.label, { color: theme.text }]}>
                  {labels[route.name]}
                </Text>
              ) : (
                <FontAwesome
                  name={icons[route.name]}
                  size={22}
                  color={theme.icon}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    width: "100%",
    alignItems: "center",
  },
  tabBar: {
    flexDirection: "row",
    width: "100%",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    elevation: 0,
    backgroundColor: "transparent",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: -2 },
    overflow: "visible",
    paddingTop: 12,
    minHeight: 72,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  floatingCircle: {
    position: "absolute",
    top: -CIRCLE_SIZE / 2 + 2,
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    zIndex: 10,
    elevation: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
  },
});
