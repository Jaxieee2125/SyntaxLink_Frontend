// app/job/_layout.tsx
import { Stack } from 'expo-router';

export default function JobLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
