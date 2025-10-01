import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';

// 1. Sử dụng Generics <T extends string>
//    - T sẽ là một kiểu dữ liệu bất kỳ, miễn là nó là một chuỗi (string).
//    - Điều này cho phép component chấp nhận bất kỳ mảng chuỗi nào.
interface FilterChipsProps<T extends string> {
  options: T[];
  selected: T;
  onSelect: (option: T) => void;
  // Thêm một prop tùy chọn để tùy chỉnh cách hiển thị tên
  renderLabel?: (option: T) => string;
}

export default function FilterChips<T extends string>({
  options,
  selected,
  onSelect,
  renderLabel = (option) => option, // Mặc định hiển thị chính giá trị đó
}: FilterChipsProps<T>) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.chip,
              selected === option
                ? styles.activeChip
                : [styles.inactiveChip, { borderColor: theme.icon }],
            ]}
            onPress={() => onSelect(option)}
          >
            <Text
              style={
                selected === option
                  ? styles.activeText
                  : [styles.inactiveText, { color: theme.textMuted }]
              }
            >
              {/* Sử dụng renderLabel để hiển thị tên */}
              {renderLabel(option)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 5,
    borderWidth: 1,
  },
  activeChip: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  inactiveChip: {
    backgroundColor: 'transparent',
  },
  activeText: {
    color: 'white',
    fontWeight: 'bold',
  },
  inactiveText: {
    fontWeight: 'bold',
  },
});