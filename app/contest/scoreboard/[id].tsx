import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, useColorScheme } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { ScoreboardEntry } from '@/types/scoreboard';
import { getScoreboard } from '@/api/contests';
import Colors from '@/constants/Colors';

const ScoreboardHeader = () => (
    <View style={styles.row}>
        <Text style={[styles.headerCell, styles.rankCell]}>#</Text>
        <Text style={[styles.headerCell, styles.nameCell]}>Thí sinh</Text>
        <Text style={[styles.headerCell, styles.solvedCell]}>Bài</Text>
        <Text style={[styles.headerCell, styles.penaltyCell]}>Penalty</Text>
    </View>
);

const ScoreboardRow = ({ item, index }: { item: ScoreboardEntry, index: number }) => {
    const colorScheme = useColorScheme() ?? 'light';
    const rowBg = index % 2 === 0 
        ? (colorScheme === 'light' ? '#F9FAFB' : '#2C2C2E')
        : 'transparent';

    return (
        <View style={[styles.row, { backgroundColor: rowBg }]}>
            <Text style={[styles.cell, styles.rankCell]}>{index + 1}</Text>
            <Text style={[styles.cell, styles.nameCell]}>{item.name}</Text>
            <Text style={[styles.cell, styles.solvedCell]}>{item.problemsSolved}</Text>
            <Text style={[styles.cell, styles.penaltyCell]}>{item.totalPenalty}</Text>
        </View>
    );
};

export default function ScoreboardScreen() {
    const { id, title } = useLocalSearchParams<{ id: string, title: string }>();
    const [scoreboard, setScoreboard] = useState<ScoreboardEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        getScoreboard(id).then(setScoreboard).finally(() => setIsLoading(false));
    }, [id]);

    if (isLoading) {
        return <ActivityIndicator style={{ flex: 1 }} size="large" />;
    }

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: `Bảng xếp hạng: ${title}` }} />
            <FlatList
                data={scoreboard}
                keyExtractor={(item) => item.userId}
                renderItem={({ item, index }) => <ScoreboardRow item={item} index={index} />}
                ListHeaderComponent={<ScoreboardHeader />}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    row: { flexDirection: 'row', paddingVertical: 12, paddingHorizontal: 10, borderBottomWidth: 1, borderBottomColor: '#e5e5e5' },
    headerCell: { fontWeight: 'bold', fontSize: 16 },
    cell: { fontSize: 16 },
    rankCell: { flex: 0.15, textAlign: 'center' },
    nameCell: { flex: 0.45 },
    solvedCell: { flex: 0.2, textAlign: 'center' },
    penaltyCell: { flex: 0.2, textAlign: 'center' },
});