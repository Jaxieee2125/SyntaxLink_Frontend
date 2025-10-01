import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, Image,useColorScheme  } from 'react-native';
import { Link, router } from 'expo-router';
import { login } from '@/api/auth';
import { useAuth } from '@/context/AuthContext';

// Import component mới
import StyledTextInput from '@/components/StyledTextInput';
import StyledButton from '@/components/StyledButton';
import Colors from '@/constants/Colors';

export default function LoginScreen() {
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();

    const handleLogin = async () => {
        if (!email || !password) { /* ... */ return; }
        setIsLoading(true);
        try {
            await login(email, password); // Gọi hàm login từ context
            // Không cần Alert hay router.replace nữa, _layout sẽ tự xử lý
        } catch (error: any) {
            Alert.alert('Đăng nhập thất bại', error.error || 'Đã có lỗi xảy ra.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Image source={require('@/assets/images/icon.png')} style={styles.logo} />
            <Text style={[styles.title, { color: theme.text }]}>Chào mừng trở lại</Text>
            <Text style={[styles.subtitle, { color: theme.text }]}>Đăng nhập để tiếp tục</Text>

            <StyledTextInput
                iconName="mail-outline"
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <StyledTextInput
                iconName="lock-closed-outline"
                placeholder="Mật khẩu"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <StyledButton title="Đăng Nhập" onPress={handleLogin} isLoading={isLoading} />
            
            <Link href="/register" style={styles.link}>
                Chưa có tài khoản? <Text style={styles.linkText}>Đăng ký ngay</Text>
            </Link>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 24 },
    logo: { width: 80, height: 80, alignSelf: 'center', marginBottom: 20 },
    title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 },
    subtitle: { fontSize: 16, color: '#6B7280', textAlign: 'center', marginBottom: 32 },
    link: { marginTop: 20, textAlign: 'center' },
    linkText: { color: '#4F46E5', fontWeight: 'bold' },
});