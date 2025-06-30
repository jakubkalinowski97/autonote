import { XStack, YStack, Text } from 'tamagui';
import { AnimatedScreen } from '../../components/ui/AnimatedScreen';
import { SearchInput } from '../../components/search-input/SearchInput';
import { useAuth } from '../../contexts/AuthContext';

export default function HomeScreen() {
  const { user } = useAuth();
  const welcomeMessages = [
    "how can I help you today?",
    "what would you like to work on?",
    "ready to take some notes?",
    "let's get productive!",
    "what's on your mind?",
    "how can I assist you?",
    "let's make something awesome!",
    "need help organizing your thoughts?",
    "let's get started!",
    "what brings you here today?"
  ];
  const randomMessage = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
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
            <Text fontSize="$8" fontFamily="$heading">Hi {user?.name},</Text>
            <Text fontSize="$5" fontFamily="$body" textAlign='center'>{randomMessage}</Text>
          </YStack>
          <XStack paddingVertical="$3">
            <SearchInput workspace={user?.last_selected_workspace.name || ''} />
          </XStack>
        </YStack>
    </AnimatedScreen>
  );
}
