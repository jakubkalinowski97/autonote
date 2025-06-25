import { YStack, Text } from 'tamagui';
import { Title } from '../../components/ui/Themed';
import { AnimatedScreen } from '../../components/ui/AnimatedScreen';

export default function Settings() {
  return (
    <AnimatedScreen>
      <YStack flex={1} backgroundColor="$background" alignItems="center" justifyContent="center" 
          paddingHorizontal="$5"
          paddingTop="$4">
        <Title>Settings</Title>
        <Text>Settings page coming soon.</Text>
      </YStack>
    </AnimatedScreen>
  );
} 