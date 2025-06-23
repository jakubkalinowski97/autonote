import { YStack, Text } from 'tamagui';
import { Title } from '../../components/ui/Themed';

export default function Notes() {
  return (
    <YStack flex={1} backgroundColor="$color2" alignItems="center" justifyContent="center">
      <Title>Notes</Title>
      <Text>All your notes will appear here.</Text>
    </YStack>
  );
} 