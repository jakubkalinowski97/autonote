import { useRouter } from 'expo-router';
import { Form, Input, Separator, YStack, XStack } from 'tamagui';
import {
  Title,
  Paragraph,
  Link,
  StyledButton,
} from '../../components/ui/Themed';

export default function Register() {
  const router = useRouter();

  const handleSignUp = () => {
    // Perform validation here (e.g., check if passwords match)
    // Perform Supabase registration logic here
    console.log('Signing up...');
    // On success, you might want to show a confirmation message
    // or automatically log the user in and redirect.
    // For now, we'll just go back to the login page.
    router.replace('/login');
  };

  return (
    <YStack flex={1}>
      <YStack alignItems="center" marginBottom="$4">
        <Title>Create Account</Title>
        <Paragraph color="$color10">
          Start your journey with us
        </Paragraph>
      </YStack>

      <Form width="100%" gap="$3" onSubmit={handleSignUp}>
        <Input placeholder="Email" size="$4" keyboardType="email-address" />
        <Input placeholder="Password" size="$4" secureTextEntry />
        <Input placeholder="Confirm Password" size="$4" secureTextEntry />

        <Form.Trigger asChild>
          <StyledButton theme="accent" size="$4" marginTop="$4" onPress={handleSignUp}>
            Sign Up
          </StyledButton>
        </Form.Trigger>
      </Form>

      <Separator width="100%" marginVertical="$4" />

      <XStack justifyContent="center" alignItems="baseline" space="$2" marginTop="$4">
        <Paragraph fontSize="$3">
          Already have an account?
        </Paragraph>
        <Link fontSize="$3" onPress={() => router.push('/login')}>
          Sign In
        </Link>
      </XStack>
    </YStack>
  );
} 