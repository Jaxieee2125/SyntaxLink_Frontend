import React from 'react';
import { View, TextInput, StyleSheet, useColorScheme, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';

export interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;

  // style override
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;

  // màu/behavior override
  placeholderTextColor?: string;
  iconColor?: string;
  selectionColor?: string;
  caretHidden?: boolean;
}

export default function SearchBar({
  value,
  onChangeText,
  placeholder = 'Tìm kiếm...',
  containerStyle,
  inputStyle,
  placeholderTextColor,
  iconColor,
  selectionColor,
  caretHidden,
}: SearchBarProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.inputBg, borderColor: theme.outline },
        containerStyle,
      ]}
    >
      <Ionicons name="search" size={20} color={iconColor ?? theme.icon} style={styles.icon} />
      <TextInput
        style={[styles.input, { color: theme.inputText }, inputStyle]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor ?? theme.placeholder}
        selectionColor={selectionColor ?? theme.caret}
        caretHidden={caretHidden}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    height: 45,
    paddingHorizontal: 12,
    marginBottom: 10,
    borderWidth: 1,
  },
  icon: { marginRight: 8 },
  input: { flex: 1, fontSize: 16 },
});
