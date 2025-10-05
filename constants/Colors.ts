// constants/Colors.ts

const brand = "#1ED760";
const brandLight = "#BBF7D0"; // hoặc '#E6FFE6' nếu muốn match chipSelectedBg light

const light = {
  text: "#0B0B0B",
  textMuted: "#6B7280",
  background: "#FFFFFF",
  surface: "#F7F7F8",
  surfaceElevated: "#FFFFFF",

  inputBg: "#FFFFFF",
  inputText: "#0B0B0B",
  placeholder: "#9CA3AF",
  outline: "#E5E7EB",
  outlineVariant: "#D1D5DB",
  caret: "#111827",

  chipBg: "#F3F4F6",
  chipText: "#111827",
  chipBorder: "#E5E7EB",
  chipSelectedBg: "#E6FFE6",
  chipSelectedText: "#065F46",
  chipSelectedBorder: "#34D399",

  divider: "#E5E7EB",
  icon: "#6B7280",
  tint: "#1F2937",

  headerGradientStart: brand,
  headerGradientEnd: "rgba(30,215,96,0)",

  buttonPrimaryBg: "#1ED760",
  buttonPrimaryText: "#FFFFFF",
  buttonDangerBg: "#EF4444",
  buttonDangerText: "#FFFFFF",

  buttonSecondaryBg: "#E5E7EB", // hoặc '#F3F4F6'
  buttonSecondaryText: "#111827",
};

const dark = {
  text: "#EDEDED",
  textMuted: "#A0A0A0",
  background: "#000000",
  surface: "#111111",
  surfaceElevated: "#1A1A1A",

  inputBg: "#141414",
  inputText: "#EDEDED",
  placeholder: "#8A8A8A",
  outline: "#27272A",
  outlineVariant: "#1F1F22",
  caret: "#FFFFFF",

  chipBg: "#18181B",
  chipText: "#E5E7EB",
  chipBorder: "#27272A",
  chipSelectedBg: "#0B2E19",
  chipSelectedText: "#A7F3D0",
  chipSelectedBorder: "#059669",

  divider: "#1F2937",
  icon: "#9CA3AF",
  tint: "#EDEDED",

  headerGradientStart: brand,
  headerGradientEnd: "rgba(30,215,96,0)",

  buttonPrimaryBg: "#1ED760",
  buttonPrimaryText: "#FFFFFF",
  buttonDangerBg: "#DC2626",
  buttonDangerText: "#FFFFFF",

  buttonSecondaryBg: "#27272A", // hoặc '#18181B'
  buttonSecondaryText: "#E5E7EB",
};

export default {
  light,
  dark,

  // Global shared colors
  primary: brand,
  primaryLight: brandLight,

  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
};
