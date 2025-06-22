import { useFonts } from 'expo-font'
import { StatusBar } from 'expo-status-bar'
import { TamaguiProvider } from 'tamagui'
import {
  Inter_400Regular,
  Inter_700Bold,
  Inter_900Black,
} from '@expo-google-fonts/inter'
import { useColorScheme } from 'react-native'
import { SafeAreaProvider } from "react-native-safe-area-context"

import config from '../tamagui.config'
import { Login } from './app/features/auth/Login'
import { MainLayout } from './app/components/layout/MainLayout'

export default function App() {
  const colorScheme = useColorScheme()

  const [loaded] = useFonts({
    Inter: Inter_400Regular,
    Inter_700: Inter_700Bold,
    Inter_900: Inter_900Black,
  })

  if (!loaded) {
    return null
  }

  return (
    <SafeAreaProvider>
      <TamaguiProvider
        config={config}
        defaultTheme={colorScheme ?? 'light'}
      >
        <MainLayout>
          <Login />
        </MainLayout>
        <StatusBar style="auto" />
      </TamaguiProvider>
    </SafeAreaProvider>
  )
} 