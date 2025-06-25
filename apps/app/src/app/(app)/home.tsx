import { XStack, YStack, Text } from 'tamagui';
import { AnimatedScreen } from '../../components/ui/AnimatedScreen';
import { SearchInput } from '../../components/search-input/SearchInput';

export default function HomeScreen() {
  return (
    <AnimatedScreen>
        <YStack
          flex={1}
          backgroundColor="$background"
          paddingBottom="$4"
          gap="$4"
          justifyContent='space-between'
          paddingHorizontal="$5"
          paddingTop="$4"
        >
          
          <YStack flex={1} alignItems='center' justifyContent='center'>
            <Text fontSize="$8" fontFamily="$heading">Hi Jakub,</Text>
            <Text fontSize="$5" fontFamily="$body">how can I help you today?</Text>
          </YStack>
          <XStack paddingVertical="$3">
            <SearchInput workspace="Work" />
          </XStack>
        </YStack>
    </AnimatedScreen>
  );
}
