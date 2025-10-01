import React, { useState, useCallback } from 'react';
import { FlatList, View, Text, StyleSheet, ActivityIndicator, useColorScheme } from 'react-native';
import { useFocusEffect, Stack } from 'expo-router';
import { Application } from '@/types/application';
import { getMyApplications } from '@/api/applications';
import ApplicationListItem from '@/components/ApplicationListItem';
import Colors from '@/constants/Colors';

export default function MyApplicationsScreen() {
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];

    const [applications, setApplications] = useState<Application[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadApplications = useCallback(() => {
        setIsLoading(true);
        getMyApplications()
            .then(setApplications)
            .finally(() => setIsLoading(false));
    }, []);

    useFocusEffect(loadApplications);
    
    if (isLoading) {
        return <ActivityIndicator style={{ flex: 1 }} size="large" />;
    }

    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>
            <Stack.Screen options={{ title: 'Đơn ứng tuyển của tôi' }} />
            <FlatList
                data={applications}
                keyExtractor={item => item._id}
                renderItem={({ item }) => <ApplicationListItem item={item} />}
                ListEmptyComponent={<Text style={styles.emptyText}>Bạn chưa ứng tuyển vào công việc nào.</Text>}
                contentContainerStyle={{ paddingTop: 10 }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16 }
});