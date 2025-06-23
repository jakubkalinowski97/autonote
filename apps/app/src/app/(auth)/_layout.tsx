import { Stack } from 'expo-router';
import { YStack } from 'tamagui';

export default function AuthLayout() {
  return (
    <YStack
      flex={1}
      justifyContent="flex-start"
      alignItems="center"
      backgroundColor="$background"
      paddingTop="$10"
    >
      <YStack width="100%" maxWidth={500} padding="$4">
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="login" />
          <Stack.Screen name="register" />
          <Stack.Screen name="forgot-password" />
          <Stack.Screen name="update-password" />
        </Stack>
      </YStack>
    </YStack>
  );
} 