import { useRouter } from 'expo-router';
import { Form, YStack } from 'tamagui';
import { Title, Paragraph, StyledButton, StyledInput } from '../../components/ui/Themed';

export default function UpdatePassword() {
  const router = useRouter();

  const handlePasswordUpdate = () => {
    // Perform validation (e.g., passwords match)
    // Perform Supabase password update logic here
    console.log('Updating password...');
    // On success, redirect to the main app
    router.replace('/home');
  };

  return (
    <YStack flex={1}>
      <YStack alignItems="center" marginBottom="$4">
        <Title>Update Password</Title>
        <Paragraph color="$color10" textAlign="center">
          Please enter your new password below.
        </Paragraph>
      </YStack>

      <Form width="100%" gap="$3" onSubmit={handlePasswordUpdate}>
        <StyledInput placeholder="New Password" size="$4" secureTextEntry />
        <StyledInput placeholder="Confirm New Password" size="$4" secureTextEntry />

        <Form.Trigger asChild>
          <StyledButton theme="accent" size="$4" marginTop="$4" onPress={handlePasswordUpdate}>
            Update Password &amp; Sign In
          </StyledButton>
        </Form.Trigger>
      </Form>
    </YStack>
  );
} 