import { YStack } from 'tamagui'
import { SafeAreaView } from 'react-native-safe-area-context'

type MainLayoutProps = {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <YStack flex={1} backgroundColor="$background">
      <SafeAreaView style={{ flex: 1 }}>{children}</SafeAreaView>
    </YStack>
  )
} 