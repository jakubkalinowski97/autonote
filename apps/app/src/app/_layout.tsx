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

import tamaguiConfig from '../../tamagui.config';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import {
  ThemeProvider as CustomThemeProvider,
  useTheme,
} from '../contexts/ThemeContext';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function Root() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const [loaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    if (loaded) {
      if (isAuthenticated) {
        router.replace('/home');
      } else {
        router.replace('/login');
      }
    }
  }, [loaded, isAuthenticated]);

  if (!loaded) {
    return null;
  }

  return <Slot />;
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <CustomThemeProvider>
          <ThemedApp>
            <Root />
          </ThemedApp>
        </CustomThemeProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

function ThemedApp({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();

  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme={'light'}>
      <ThemeProvider value={DefaultTheme}>
        {children}
      </ThemeProvider>
    </TamaguiProvider>
  );
}
