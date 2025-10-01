import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, Image } from 'react-native';
import { Link, router } from 'expo-router';
import { useAuth } from '@/context/AuthContext'; // Import useAuth
import { register as apiRegister } from '@/api/auth';

import StyledTextInput from '@/components/StyledTextInput';
import StyledButton from '@/components/StyledButton';

export default function RegisterScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    // Auth context không có hàm register, nên ta vẫn dùng API trực tiếp
    // nhưng có thể nâng cấp context sau này nếu muốn

    const handleRegister = async () => {
        if (!name || !email || !password) {
            Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin.');
            return;
        }

        setIsLoading(true);
        try {
            await apiRegister(name, email, password);
            Alert.alert(
                'Thành công!',
                'Tài khoản của bạn đã được tạo. Hãy đăng nhập để bắt đầu.',
                [{ text: 'OK', onPress: () => router.replace('/login') }]
            );
        } catch (error: any) {
            Alert.alert('Đăng ký thất bại', error.error || 'Email này có thể đã được sử dụng.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Image source={require('@/assets/images/icon.png')} style={styles.logo} />
            <Text style={styles.title}>Tạo tài khoản mới</Text>
            <Text style={styles.subtitle}>Bắt đầu hành trình của bạn</Text>
            
            <StyledTextInput
                iconName="person-outline"
                placeholder="Họ và Tên"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
            />
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

            <StyledButton title="Đăng Ký" onPress={handleRegister} isLoading={isLoading} />

            <Link href="/login" style={styles.link}>
                Đã có tài khoản? <Text style={styles.linkText}>Đăng nhập</Text>
            </Link>
        </View>
    );
}

// Sử dụng lại style của trang Login
const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
    logo: { width: 80, height: 80, alignSelf: 'center', marginBottom: 20 },
    title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 },
    subtitle: { fontSize: 16, color: '#6B7280', textAlign: 'center', marginBottom: 32 },
    link: { marginTop: 20, textAlign: 'center' },
    linkText: { color: '#4F46E5', fontWeight: 'bold' },
});