import { YStack, Text } from 'tamagui';
import { Title } from '../../components/ui/Themed';
import { AnimatedScreen } from '../../components/ui/AnimatedScreen';

export default function Search() {
  return (
    <AnimatedScreen>
      <YStack flex={1} backgroundColor="$background" alignItems="center" justifyContent="center">
        <Title>Search</Title>
        <Text>Search page coming soon.</Text>
      </YStack>
    </AnimatedScreen>
  );
} 