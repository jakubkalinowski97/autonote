import { YStack, Text } from 'tamagui';
import { Title } from '../../components/ui/Themed';

export default function Search() {
  return (
    <YStack flex={1} backgroundColor="$color2" alignItems="center" justifyContent="center">
      <Title>Search</Title>
      <Text>Search your notes and workspaces here.</Text>
    </YStack>
  );
} 