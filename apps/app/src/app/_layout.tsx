import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { TamaguiProvider, useTheme as useTamaguiTheme } from 'tamagui';
import { Slot, useRouter } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Linking from 'expo-linking';
import { storage } from '../utils/storage';

import tamaguiConfig from '../../tamagui.config';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import {
  ThemeProvider as CustomThemeProvider,
  useTheme,
} from '../contexts/ThemeContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

SplashScreen.preventAutoHideAsync();

function Root() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  console.log(window.location.href);
  
  const [loadedFonts] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  });

  useEffect(() => {
    if (loadedFonts) {
      SplashScreen.hideAsync();
    }
  }, [loadedFonts]);

  useEffect(() => {
    if (loadedFonts && !loading) {
      console.log('isAuthenticated', isAuthenticated);
      if (isAuthenticated) {
        router.replace('/home');
      } else {
        router.replace('/login');
      }
    }
  }, [loadedFonts, isAuthenticated, loading]);

  if (!loadedFonts) {
    return null;
  }

  return <Slot />;
}

export default function RootLayout() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <CustomThemeProvider>
            <ThemedApp>
              <Root />
            </ThemedApp>
          </CustomThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

function ThemedApp({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();

  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme={'light'}>
      <ThemeProvider value={DefaultTheme}>{children}</ThemeProvider>
    </TamaguiProvider>
  );
}
