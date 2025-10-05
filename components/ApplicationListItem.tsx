import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { Application, ApplicationStatusValue } from '@/types/application';
import Colors from '@/constants/Colors';

const getStatusDetails = (status: ApplicationStatusValue) => {
    switch (status) {
        case 'submitted': return { text: 'Đã nộp', color: Colors.success };
        case 'viewed': return { text: 'NTD đã xem', color: '#3B82F6' };
        case 'interview': return { text: 'Mời phỏng vấn', color: '#10B981' };
        case 'offered': return { text: 'Đã nhận offer', color: Colors.success };
        case 'rejected': return { text: 'Bị từ chối', color: '#EF4444' };
        case 'hired': return { text: 'Đã trúng tuyển', color: Colors.success };
        default: return { text: status, color: '#6B7280' };
    }
}

export default function ApplicationListItem({ item }: { item: Application }) {
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];
    const statusDetails = getStatusDetails(item.status);

    return (
        <View style={[styles.container, { backgroundColor: theme.surface }]}>
            {/* ========================================================== */}
            {/* SỬA LỖI LAYOUT Ở ĐÂY */}
            {/* ========================================================== */}
            <View style={styles.content}>
                <Text 
                    style={[styles.title, { color: theme.text }]}
                    numberOfLines={1} // Chỉ hiển thị 1 dòng
                    ellipsizeMode="tail" // Thêm "..." ở cuối
                >
                    {item.jobId.title}
                </Text>
                <Text 
                    style={[styles.company, { color: theme.textMuted }]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    {item.jobId.creator.name}
                </Text>
                <Text style={[styles.date, { color: theme.icon }]}>
                    Nộp ngày: {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                </Text>
            </View>
            <View style={[styles.statusTag, { backgroundColor: statusDetails.color }]}>
                <Text style={styles.statusText}>{statusDetails.text}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: 16, 
        marginHorizontal: 16, 
        marginVertical: 8, 
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#333' // Thêm viền nhẹ
    },
    // Style mới cho content
    content: {
        flex: 1, // Cho phép content co giãn
        marginRight: 10, // Tạo khoảng cách với status tag
    },
    title: { 
        fontSize: 16, 
        fontWeight: 'bold', 
        marginBottom: 4 
    },
    company: { 
        fontSize: 14, 
        marginBottom: 8 
    },
    date: { 
        fontSize: 12 
    },
    statusTag: { 
        paddingHorizontal: 12, 
        paddingVertical: 6, 
        borderRadius: 20,
        alignSelf: 'flex-start' // Đảm bảo tag không bị kéo giãn
    },
    statusText: { 
        color: 'white', 
        fontSize: 12, 
        fontWeight: 'bold' 
    },
});