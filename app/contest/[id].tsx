import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, useColorScheme, Alert } from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { ContestDetail, ContestStatus } from '@/types/contest';
import { getContestById, registerForContest } from '@/api/contests';
import Colors from '@/constants/Colors';
import StyledButton from '@/components/StyledButton';
import { useAuth } from '@/context/AuthContext'; // Cần để biết user hiện tại
import { TouchableOpacity } from 'react-native';

const getContestStatus = (startTime: string, endTime: string): ContestStatus => {
    const now = new Date();
    if (now < new Date(startTime)) return 'Upcoming';
    if (now > new Date(endTime)) return 'Finished';
    return 'Running';
};

export default function ContestDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];

    const [contest, setContest] = useState<ContestDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRegistering, setIsRegistering] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchContest = async () => {
        if (!id) return;
        try {
            const data = await getContestById(id);
            setContest(data);
        } catch (err: any) {
            setError(err.error || 'Không thể tải chi tiết cuộc thi.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchContest();
    }, [id]);

    const handleRegister = async () => {
        if (!id) return;
        setIsRegistering(true);
        try {
            await registerForContest(id);
            Alert.alert('Thành công', 'Bạn đã đăng ký tham gia cuộc thi!');
            // Tải lại dữ liệu để cập nhật danh sách người tham gia
            fetchContest();
        } catch (err: any) {
            Alert.alert('Lỗi', err.error || 'Không thể đăng ký.');
        } finally {
            setIsRegistering(false);
        }
    }

    if (isLoading) {
        return <View style={styles.centered}><ActivityIndicator size="large" /></View>;
    }

    if (error || !contest) {
        return <View style={styles.centered}><Text style={{ color: 'red' }}>Lỗi: {error}</Text></View>;
    }

    const status = getContestStatus(contest.startTime, contest.endTime);

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
            <Stack.Screen options={{ title: contest.title }} />
            <View style={styles.header}>
                <Text style={[styles.title, { color: theme.text }]}>{contest.title}</Text>
                <Text style={[styles.time, { color: theme.icon }]}>
                    {new Date(contest.startTime).toLocaleString('vi-VN')} - {new Date(contest.endTime).toLocaleString('vi-VN')}
                </Text>
            </View>

            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>Mô tả</Text>
                <Text style={[styles.description, { color: theme.text }]}>{contest.description}</Text>
            </View>

            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>Danh sách bài tập</Text>
                {contest.problems.map(p => (
                    // BỌC TRONG TOUCHABLEOPACITY
                    <TouchableOpacity
                        key={p.problemId._id}
                        style={styles.problemItemWrapper}
                        onPress={() => router.push({
                            pathname: "/problem/[id]",
                            // TRUYỀN CONTEST ID QUA PARAMS
                            params: { id: p.problemId._id, contestId: contest._id }
                        })}
                    >
                        <View style={styles.problemItem}>
                            <Text style={[styles.problemAlias, { color: theme.text }]}>Bài {p.alias}:</Text>
                            <Text style={[styles.problemTitle, { color: theme.text }]}>{p.problemId.title}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.buttonContainer}>
                {status === 'Upcoming' && <StyledButton title="Đăng ký ngay" onPress={handleRegister} isLoading={isRegistering} />}
                {status === 'Running' && 
                    <StyledButton 
                        title="Vào thi" 
                        onPress={() => router.push({
                            pathname: "/contest/arena/[id]",
                            params: { id: contest._id }
                        })} 
                    />
                }

                {status === 'Finished' && <StyledButton title="Xem bảng xếp hạng" onPress={() => router.push({ 
                    pathname: "/contest/scoreboard/[id]",
                    params: { id: contest._id, title: contest.title }
                })} />}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    container: { flex: 1 },
    header: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#e5e5e5' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
    time: { fontSize: 14, color: '#666' },
    section: { marginTop: 20, paddingHorizontal: 20 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
    description: { fontSize: 16, lineHeight: 24 },
    problemItemWrapper: { // Style mới
        borderRadius: 8,
        overflow: 'hidden'
    },
    problemItem: { // Style cũ
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 8,
    },
    problemAlias: { fontSize: 16, fontWeight: 'bold', marginRight: 8 },
    problemTitle: { fontSize: 16 },
    buttonContainer: { padding: 20, marginTop: 30 },
});