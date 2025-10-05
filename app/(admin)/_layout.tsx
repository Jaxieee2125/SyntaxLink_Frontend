// app/(admin)/_layout.tsx
import { Slot } from "expo-router";
import { useAuth } from "@/context/AuthContext";

export default function AdminLayout() {
  const { user } = useAuth();
  if (user?.role !== "admin") return null; // chặn người không phải admin

  return <Slot />; // tất cả màn con (tabs + stack) sẽ hiển thị ở đây
}
