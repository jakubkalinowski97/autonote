import { useRouter } from 'expo-router';
import { Form, YStack } from 'tamagui';
import { Title, Paragraph, Link, StyledButton, StyledInput } from '../../components/ui/Themed';

export default function ForgotPassword() {
  const router = useRouter();

  const handlePasswordResetRequest = () => {
    // Perform Supabase password reset request logic here
    console.log('Requesting password reset...');
    // On success, you might want to show a confirmation message
    alert('If an account exists, a password reset link has been sent.');
  };

  return (
    <YStack flex={1}>
      <YStack alignItems="center" marginBottom="$4">
        <Title>Forgot Password</Title>
        <Paragraph color="$color10" textAlign="center">
          Enter your email to receive a reset link.
        </Paragraph>
      </YStack>

      <Form width="100%" gap="$3" onSubmit={handlePasswordResetRequest}>
        <StyledInput placeholder="Email" size="$4" keyboardType="email-address" />

        <Form.Trigger asChild>
          <StyledButton theme="accent" size="$4" marginTop="$4" onPress={handlePasswordResetRequest}>
            Send Reset Link
          </StyledButton>
        </Form.Trigger>
      </Form>

      <YStack alignItems="center" marginTop="$4">
        <Link fontSize="$3" onPress={() => router.back()}>
          Back to Sign In
        </Link>
      </YStack>
    </YStack>
  );
} 