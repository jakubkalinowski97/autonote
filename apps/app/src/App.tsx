import { useFonts } from 'expo-font'
import { StatusBar } from 'expo-status-bar'
import { TamaguiProvider, Text, View } from 'tamagui'
import { Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter'
import { useColorScheme } from 'react-native'

import config from '../tamagui.config'

export default function App() {
  const colorScheme = useColorScheme()

  const [loaded] = useFonts({
    Inter: Inter_400Regular,
    InterBold: Inter_700Bold,
  })

  if (!loaded) {
    return null
  }

  return (
    <TamaguiProvider
      config={config}
      defaultTheme={colorScheme === 'dark' ? 'dark_blue' : 'light_blue'}
    >
      <View flex={1} alignItems="center" justifyContent="center" backgroundColor="$background">
        <Text color="$color">Open up App.tsx to start working on your app!</Text>
        <StatusBar style="auto" />
      </View>
    </TamaguiProvider>
  )
} 