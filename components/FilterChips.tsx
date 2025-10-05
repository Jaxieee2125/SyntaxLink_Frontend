import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, useColorScheme, ViewStyle, TextStyle } from 'react-native';
import Colors from '@/constants/Colors';

export interface FilterChipsProps<T extends string> {
  options: T[];
  selected: T;
  onSelect: (option: T) => void;
  renderLabel?: (option: T) => string;

  containerStyle?: ViewStyle;
  chipStyle?: ViewStyle;
  chipTextStyle?: TextStyle;
  selectedChipStyle?: ViewStyle;
  selectedChipTextStyle?: TextStyle;
}

export default function FilterChips<T extends string>({
  options,
  selected,
  onSelect,
  renderLabel = (o) => o,
  containerStyle,
  chipStyle,
  chipTextStyle,
  selectedChipStyle,
  selectedChipTextStyle,
}: FilterChipsProps<T>) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  return (
    <View style={[styles.container, containerStyle]}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {options.map((option) => {
          const active = selected === option;
          const baseChip: ViewStyle[] = [
            styles.chip,
            { backgroundColor: theme.chipBg, borderColor: theme.chipBorder },
            chipStyle ?? {},
          ];
          const activeChip: ViewStyle[] = [
            styles.chip,
            { backgroundColor: theme.chipSelectedBg, borderColor: theme.chipSelectedBorder },
            selectedChipStyle ?? {},
          ];
          const baseText: TextStyle[] = [
            styles.text,
            { color: theme.chipText },
            chipTextStyle ?? {},
          ];
          const activeText: TextStyle[] = [
            styles.textActive,
            { color: theme.chipSelectedText },
            selectedChipTextStyle ?? {},
          ];

          return (
            <TouchableOpacity
              key={option}
              style={active ? activeChip : baseChip}
              onPress={() => onSelect(option)}
            >
              <Text style={active ? activeText : baseText}>{renderLabel(option)}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingVertical: 8 },
  row: { paddingHorizontal: 0 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 6,
    borderWidth: 1,
  },
  text: {
    fontSize: 14,
    fontWeight: 600 as TextStyle['fontWeight'], // ✅ numeric literal
  },
  textActive: {
    fontSize: 14,
    fontWeight: 700 as TextStyle['fontWeight'], // ✅ numeric literal
  },
});
