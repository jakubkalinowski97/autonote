import { YStack, Text } from 'tamagui';
import { Title } from '../../components/ui/Themed';
import { AnimatedScreen } from '../../components/ui/AnimatedScreen';

export default function NewNote() {
  return (
    <AnimatedScreen>
      <YStack flex={1} backgroundColor="$background" alignItems="center" justifyContent="center" 
          paddingHorizontal="$5"
          paddingTop="$4">
        <Title>New Note</Title>
        <Text>This is where you'll create a new note.</Text>
      </YStack>
    </AnimatedScreen>
  );
} 