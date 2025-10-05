import { AuthProvider, useAuth } from "@/context/AuthContext";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, router, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { ActivityIndicator, View, useColorScheme } from "react-native";
import "react-native-reanimated";
import {  usePathname } from "expo-router";

// Bắt các lỗi được ném ra bởi Layout component.
export { ErrorBoundary } from "expo-router";

// Cài đặt ban đầu cho router.
export const unstable_settings = {
  initialRouteName: "(tabs)",
};

// Ngăn màn hình splash tự động ẩn đi.
SplashScreen.preventAutoHideAsync();

/**
 * Component "Gác cổng" (Gatekeeper).
 * Xử lý logic tải tài nguyên và điều hướng dựa trên trạng thái xác thực.
 */
function InitialLayout() {
  const { authStatus, user } = useAuth();
  const segments = useSegments();
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? DarkTheme : DefaultTheme;
const pathname = usePathname();

  const [loaded, error] = useFonts({
    // Thêm font của bạn ở đây nếu cần.
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);


useEffect(() => {
  if (!loaded || authStatus !== 'authenticated') return;

  const role = user?.role ?? 'developer';
  const segs = [...segments];
  const group = segs[0] ?? null;

  const isInAdminGroup = group === '(admin)';
  const isInEmployerGroup = group === '(employer)';
  // ✅ tabs của developer nằm trong group (developer)
  const isInDevTabsGroup = group === '(developer)';
  const isRoot = pathname === '/' || pathname === '';
  const isInTabsGroup = group === '(tabs)' || isInDevTabsGroup || isRoot;

  const isAllowedOutsideTabs =
    pathname?.startsWith('/problem/') ||
    pathname?.startsWith('/contest/') ||
    pathname?.startsWith('/submission/') ||
    pathname?.startsWith('/job/')||
    pathname?.startsWith('/profile/') ||
    pathname === '/solve' ||
    pathname === '/submissionHistory';

  if (role === 'admin' && !isInAdminGroup) {
    router.replace('/(admin)/(tabs)');
    return;
  }
  if (role === 'employer' && !isInEmployerGroup) {
    router.replace('/(employer)/(tabs)');
    return;
  }
  // ✅ Developer: cho phép ở (developer) (tức dev tabs) hoặc các trang detail
  if (role !== 'admin' && role !== 'employer' && !isInTabsGroup && !isAllowedOutsideTabs) {
    router.replace('/(developer)/(tabs)');
    return;
  }
}, [authStatus, loaded, segments, pathname, user?.role]);


  if (!loaded || authStatus === "loading") {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ThemeProvider value={theme}>
      <Stack key={authStatus}>
        {/* === CÁC ROUTE GROUP CHÍNH === */}
        <Stack.Screen name="(developer)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(employer)" options={{ headerShown: false }} />
        <Stack.Screen
          name="(admin)"
          options={{
            headerShown: false,
          }}
        />

        {/* === CÁC MÀN HÌNH CHI TIẾT (Detail Screens) === */}
        {/* Nhóm các màn hình này lại với nhau và cho chúng style header đồng nhất. */}
        <Stack.Screen
          name="problem/[id]"
          options={{
            title: "", // Được cập nhật động từ component
            headerStyle: { backgroundColor: theme.colors.background },
            headerTintColor: theme.colors.text,
          }}
        />
        <Stack.Screen
          name="contest/[id]"
          options={{
            title: "", // Được cập nhật động từ component
            headerStyle: { backgroundColor: theme.colors.background },
            headerTintColor: theme.colors.text,
          }}
        />
        <Stack.Screen
          name="submission/[id]"
          options={{
            title: "", // Được cập nhật động từ component
            headerStyle: { backgroundColor: theme.colors.background },
            headerTintColor: theme.colors.text,
          }}
        />

        <Stack.Screen
          name="contest/scoreboard/[id]"
          options={{
            title: "Bảng xếp hạng", // Tiêu đề có thể được cập nhật động
            headerStyle: { backgroundColor: theme.colors.background },
            headerTintColor: theme.colors.text,
          }}
        />

        <Stack.Screen
          name="contest/arena/[id]"
          options={{
            headerStyle: { backgroundColor: theme.colors.background },
            headerTintColor: theme.colors.text,
          }}
        />

        <Stack.Screen
          name="profile/edit"
          options={{
            presentation: "modal",
            title: "Chỉnh sửa Hồ sơ",
            headerStyle: { backgroundColor: theme.colors.background },
            headerTintColor: theme.colors.text,
          }}
        />
        <Stack.Screen
          name="job/[id]"
          options={{
            title: "", // Sẽ được cập nhật động
            headerStyle: { backgroundColor: theme.colors.background },
            headerTintColor: theme.colors.text,
          }}
        />
        <Stack.Screen
          name="profile/cv" // Tên file là cv.tsx trong thư mục profile
          options={{
            title: "Xem CV", // Tiêu đề mặc định
            headerStyle: { backgroundColor: theme.colors.background },
            headerTintColor: theme.colors.text,
          }}
        />
        <Stack.Screen
          name="profile/my-applications"
          options={{
            title: "Đơn ứng tuyển",
            headerStyle: { backgroundColor: theme.colors.background },
            headerTintColor: theme.colors.text,
          }}
        />
        {/* === CÁC MÀN HÌNH DẠNG MODAL === */}
        <Stack.Screen
          name="solve"
          options={{ presentation: "modal", headerShown: false }}
        />
        <Stack.Screen
          name="submissionHistory"
          options={{ presentation: "modal" }}
        />
        <Stack.Screen name="modal" options={{ presentation: "modal" }} />
      </Stack>
    </ThemeProvider>
  );
}

/**
 * Component Layout gốc của toàn bộ ứng dụng.
 */
export default function RootLayout() {
  return (
    <AuthProvider>
      <InitialLayout />
    </AuthProvider>
  );
}
