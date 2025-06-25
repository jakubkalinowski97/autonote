import React, { createContext, useContext, useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../api';
import { storage } from '../utils/storage';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { Linking, Platform } from 'react-native';

interface User {
  id: string;
  email: string;
  [key: string]: any;
}

interface AuthContextData {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextData | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const fragment = window.location.hash.substring(1);
      const params = new URLSearchParams(fragment);
      const accessToken = params.get('access_token');
      if (accessToken) {
        storage.setItem('jwt', accessToken);
        window.location.replace('/home');
      }
    }
  }, []);

  useEffect(() => {
    const handleUrl = async (event: { url: string }) => {
      const url = new URL(event.url);
      const fragment = url.hash.substring(1);
      const params = new URLSearchParams(fragment);
      const accessToken = params.get('access_token');
      if (accessToken) {
        storage.setItem('jwt', accessToken);
      }
    };
    const subscription = Linking.addEventListener('url', handleUrl);
    return () => subscription.remove();
  }, []);

  // Fetch user profile if JWT exists
  const {
    data: user,
    isLoading: loading,
    refetch,
  } = useQuery<User | null>({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await api.get('/auth/profile');
      return res.data;
    },
    retry: false,
    enabled: false, // Only fetch after login or if JWT exists
  });

  // On mount, try to fetch profile if JWT exists
  useEffect(() => {
    const jwt = storage.getItem('jwt');
    if (jwt) refetch();
  }, [refetch]);

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      setError(null);
      const res = await api.post('/auth/login', { email, password });
      const token = res.data.session.access_token;
      await storage.setItem('jwt', token);
      await refetch();
    },
    onError: (err: any) =>
      setError(err?.response?.data?.message || 'Login failed'),
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      setError(null);
      await api.post('/auth/register', { email, password });
    },
    onError: (err: any) =>
      setError(err?.response?.data?.message || 'Registration failed'),
  });

  // Request password reset mutation
  const requestPasswordResetMutation = useMutation({
    mutationFn: async ({ email }: { email: string }) => {
      setError(null);
      await api.post('/auth/forgot-password', { email });
    },
    onError: (err: any) =>
      setError(err?.response?.data?.message || 'Password reset request failed'),
  });

  // Update password mutation
  const updatePasswordMutation = useMutation({
    mutationFn: async ({ newPassword }: { newPassword: string }) => {
      setError(null);
      await api.post('/auth/update-password', { newPassword });
    },
    onError: (err: any) =>
      setError(err?.response?.data?.message || 'Password update failed'),
  });

  // Logout
  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      // Optionally log error
    }
    await storage.deleteItem('jwt');
    queryClient.removeQueries({ queryKey: ['profile'] });
  };

  const login = async (email: string, password: string) => {
    await loginMutation.mutateAsync({ email, password });
  };

  const register = async (email: string, password: string) => {
    await registerMutation.mutateAsync({ email, password });
  };

  const requestPasswordReset = async (email: string) => {
    await requestPasswordResetMutation.mutateAsync({ email });
  };

  const updatePassword = async (newPassword: string) => {
    await updatePasswordMutation.mutateAsync({ newPassword });
  };

  const loginWithGoogle = async () => {
    setError(null);
    try {
      const { data } = await api.get('/auth/oauth/google');
      const authUrl = data.url || data.data?.url || data;

      if (Platform.OS === 'web') {
        window.location.href = authUrl;
        return;
      }

      const result = await WebBrowser.openAuthSessionAsync(
        authUrl,
        AuthSession.makeRedirectUri()
      );

      if (result.type === 'success' && result.url) {
        const url = new URL(result.url);
        const fragment = url.hash.substring(1); // remove leading '#'
        const params = new URLSearchParams(fragment);
        const accessToken = params.get('access_token');
        console.log('accessToken', accessToken);
        if (accessToken) {
          storage.setItem('jwt', accessToken);
          await refetch();
        }
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Google login failed');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user: user || null,
        login,
        logout,
        register,
        requestPasswordReset,
        updatePassword,
        loginWithGoogle,
        loading:
          loading ||
          loginMutation.isPending ||
          registerMutation.isPending ||
          requestPasswordResetMutation.isPending ||
          updatePasswordMutation.isPending,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
