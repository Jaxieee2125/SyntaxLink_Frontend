// File: constants/Colors.ts

// Bảng màu chính - Đơn sắc & Tối giản
const primary = '#1F2937'; // Gray-800 (Màu nhấn là màu xám đậm)
const primaryLight = '#4B5563'; // Gray-600

const backgroundDark = '#000000'; // Nền đen tuyền
const surfaceDark = '#111111';    // Bề mặt xám rất đậm
const textDark = '#EDEDED';
const textDarkMuted = '#A0A0A0';

const backgroundLight = '#FFFFFF'; // Nền trắng tinh
const surfaceLight = '#F5F5F5';    // Bề mặt xám rất nhạt
const textLight = '#111111';
const textLightMuted = '#767676';

// ==========================================================
// THÊM CÁC MÀU MỚI DÀNH RIÊNG CHO HEADER GRADIENT
// ==========================================================
const headerGradientDarkStart = '#27272A'; // Xám Zinc-800, sáng hơn một chút
const headerGradientDarkEnd = '#18181B';   // Xám Zinc-900, tối hơn

const headerGradientLightStart = '#FFFFFF'; // Trắng
const headerGradientLightEnd = '#F4F4F5';   // Xám Zinc-100, hơi xám nhẹ


export default {
  light: {
    text: textLight,
    background: backgroundLight,
    tint: primary,
    icon: textLightMuted,
    surface: surfaceLight,
    textMuted: textLightMuted,
    headerGradientStart: headerGradientLightStart,
    headerGradientEnd: headerGradientLightEnd,
  },
  dark: {
    text: textDark,
    background: backgroundDark,
    tint: textDark, // Tint màu tối là màu chữ luôn
    icon: textDarkMuted,
    surface: surfaceDark,
    textMuted: textDarkMuted,
    headerGradientStart: headerGradientDarkStart,
    headerGradientEnd: headerGradientDarkEnd,
  },
  primary: primary,
  primaryLight: primaryLight,
  // Trạng thái (vẫn giữ màu để thông báo rõ ràng)
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
};