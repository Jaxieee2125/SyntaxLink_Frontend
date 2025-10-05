// app/(employer)/_layout.tsx
import { Slot } from "expo-router";
import { useAuth } from "@/context/AuthContext";

export default function EmployerLayout() {
  const { user } = useAuth();
  if (user?.role !== "employer") return null; // chặn người không phải employer

  return <Slot />; // tất cả màn con (tabs + stack) sẽ hiển thị ở đây
}
