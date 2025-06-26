import React from 'react';
import { YStack } from 'tamagui';
import { Title, Paragraph, StyledButton } from '../../components/ui/Themed';
import { useRouter } from 'expo-router';
import { AnimatedScreen } from '../../components/ui/AnimatedScreen';

export default function RegistrationSuccess() {
  const router = useRouter();
  return (
    <AnimatedScreen>
      <YStack flex={1} alignItems="center" justifyContent="flex-start">
        <YStack alignItems="center" marginBottom="$4">
          <Title>Registration Successful!</Title>
        </YStack>
        <YStack width="100%" padding="$4">
          <Paragraph color="$color9" marginBottom="$6" textAlign="center">
            Please check your email and confirm your account before logging in.
          </Paragraph>
          <StyledButton
            theme="accent"
            size="$4"
            onPress={() => router.replace('/login')}
          >
            Continue
          </StyledButton>
        </YStack>
      </YStack>
    </AnimatedScreen>
  );
}
