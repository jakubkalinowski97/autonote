import { YStack, Text } from 'tamagui';
import { Title } from '../../components/ui/Themed';

export default function NewNote() {
  return (
    <YStack flex={1} 
    backgroundColor="$color2" alignItems="center" justifyContent="center">
      <Title>New Note</Title>
      <Text>This is where you'll create a new note.</Text>
    </YStack>
  );
} 