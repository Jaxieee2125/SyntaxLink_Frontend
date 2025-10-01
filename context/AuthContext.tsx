import React, { createContext, useState, useEffect, useContext, PropsWithChildren } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login as apiLogin, register as apiRegister } from '@/api/auth';
import apiClient from '@/api/client';
import { User } from '@/types/user'; // Import User type
import { router } from 'expo-router';

type AuthStatus = 'authenticated' | 'unauthenticated' | 'loading';

// Bổ sung 'user' vào interface
interface AuthContextData {
  user: User | null;
  token: string | null;
  authStatus: AuthStatus;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null); // State mới cho user
  const [token, setToken] = useState<string | null>(null);
  const [authStatus, setAuthStatus] = useState<AuthStatus>('loading');

  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('user_token');
        const storedUser = await AsyncStorage.getItem('user_data');

        if (storedToken && storedUser) {
          const userData: User = JSON.parse(storedUser);
          setToken(storedToken);
          setUser(userData);
          apiClient.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
          setAuthStatus('authenticated');
        } else {
          setAuthStatus('unauthenticated');
        }
      } catch (e) {
        setAuthStatus('unauthenticated');
      } finally {
        // Có thể thêm logic ẩn Splash Screen ở đây
      }
    };
    loadAuthData();
  }, []);

  const login = async (email: string, password: string) => {
    const data = await apiLogin(email, password);
    setToken(data.token);
    setUser(data.user);
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    await AsyncStorage.setItem('user_token', data.token);
    await AsyncStorage.setItem('user_data', JSON.stringify(data.user));
    setAuthStatus('authenticated');
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    delete apiClient.defaults.headers.common['Authorization'];
    await AsyncStorage.removeItem('user_token');
    await AsyncStorage.removeItem('user_data');
    setAuthStatus('unauthenticated');
    // Chuyển về trang login sau khi logout
    router.replace('/login');
  };

  const value = { user, token, authStatus, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};