// app/(developer)/_layout.tsx
import { Slot } from "expo-router";
import { useAuth } from "@/context/AuthContext";

export default function DeveloperLayout() {
  const { user } = useAuth();
  if (user?.role !== "developer") return null; // chặn người không phải developer

  return <Slot />; // tất cả màn con (tabs + stack) sẽ hiển thị ở đây
}
