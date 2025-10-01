import React from 'react';
import { View, TextInput, StyleSheet, TextInputProps, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';

interface StyledTextInputProps extends TextInputProps {
  iconName: React.ComponentProps<typeof Ionicons>['name'];
}

export default function StyledTextInput({ iconName, ...props }: StyledTextInputProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  return (
    <View style={[styles.container, { backgroundColor: theme.surface }]}>
      <Ionicons name={iconName} size={20} color={theme.textMuted} style={styles.icon} />
      <TextInput
        style={[styles.input, { color: theme.text }]}
        placeholderTextColor={theme.textMuted}
        {...props}
      />
    </View>
  );
}

// Các style không đổi giữ nguyên trong StyleSheet.create
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    height: 50,
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
});