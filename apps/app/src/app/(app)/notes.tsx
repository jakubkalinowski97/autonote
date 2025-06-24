import { YStack, Text } from 'tamagui';
import { Title } from '../../components/ui/Themed';
import { AnimatedScreen } from '../../components/ui/AnimatedScreen';

export default function Notes() {
  return (
    <AnimatedScreen>
      <YStack flex={1} backgroundColor="$background" alignItems="center" justifyContent="center">
        <Title>Notes</Title>
        <Text>Notes page coming soon.</Text>
      </YStack>
    </AnimatedScreen>
  );
} 