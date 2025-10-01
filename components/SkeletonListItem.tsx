import React from 'react';
import { View, StyleSheet, useColorScheme } from 'react-native';
import { Skeleton } from 'moti/skeleton'; // Import Skeleton từ moti
import Colors from '@/constants/Colors';

export default function SkeletonListItem() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  // Màu sắc cho skeleton, tối hơn một chút so với màu nền/bề mặt
  const skeletonColor = colorScheme === 'light' ? '#E5E7EB' : '#374151';

  return (
    <View style={[styles.container, { backgroundColor: theme.surface }]}>
      <View style={styles.placeholderContainer}>
        {/* Skeleton cho Icon */}
        <Skeleton colorMode={colorScheme} width={48} height={48} radius={12} />
        
        <View style={styles.textPlaceholderContainer}>
          {/* Skeleton cho các dòng text */}
          <Skeleton colorMode={colorScheme} height={16} width={'80%'} />
          <Skeleton colorMode={colorScheme} height={14} width={'50%'} />
          <Skeleton colorMode={colorScheme} height={12} width={'60%'} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
  },
  placeholderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textPlaceholderContainer: {
    flex: 1,
    marginLeft: 16,
    gap: 8,
  },
});