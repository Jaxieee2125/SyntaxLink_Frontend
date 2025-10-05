import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, useColorScheme } from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { getJobApplicants } from '@/api/applications'; // Cần tạo API này
import { Application } from '@/types/application';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';

// ApplicantItem
const ApplicantItem = ({ item }: { item: Application }) => {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  return (
    <TouchableOpacity
      style={[styles.itemContainer, { backgroundColor: theme.surface }]}
      onPress={() =>
        router.push({
          pathname: '/profile/user/[id]',
          params: { id: item.applicantId._id },
        })
      }
    >
      <View>
        <Text style={[styles.name, { color: theme.text }]}>
          {item.applicantId.name}
        </Text>
        <Text style={[styles.email, { color: theme.textMuted }]}>
          {item.applicantId.email}
        </Text>
      </View>
      <Text style={[styles.status, { color: theme.tint }]}>{item.status}</Text>
    </TouchableOpacity>
  );
};


export default function ApplicantListScreen() {
    const { id, title } = useLocalSearchParams<{ id: string, title: string }>();
    const [applicants, setApplicants] = useState<Application[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        getJobApplicants(id).then(setApplicants).finally(() => setIsLoading(false));
    }, [id]);

    if (isLoading) return <ActivityIndicator style={{ flex: 1 }} />;

    return (
        <View style={{ flex: 1 }}>
            <Stack.Screen options={{ title: `Ứng viên: ${title}` }} />
            <FlatList
                data={applicants}
                keyExtractor={item => item._id}
                renderItem={({ item }) => <ApplicantItem item={item} />}
                ListEmptyComponent={<Text style={styles.emptyText}>Chưa có ứng viên nào.</Text>}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    itemContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, margin: 8, borderRadius: 12 },
    name: { fontSize: 16, fontWeight: 'bold' },
    email: { fontSize: 14, marginTop: 4 },
    status: { fontSize: 14, fontWeight: 'bold' },
    emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16 },
});