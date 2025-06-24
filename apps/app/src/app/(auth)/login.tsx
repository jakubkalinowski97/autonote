import { useRouter } from 'expo-router';
import { Form, Separator, YStack, XStack } from 'tamagui';
import { useAuth } from '../../contexts/AuthContext';
import {
  Title,
  Paragraph,
  Link,
  StyledButton,
  StyledInput,
} from '../../components/ui/Themed';

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();

  const handleSignIn = () => {
    // Perform login logic here (e.g., API call)
    // On success, call the login function from the context
    login('user@email.com'); // TODO: Get email from input
    router.replace('/home');
  };

  return (
    <YStack
      flex={1}
      alignItems="center"
      justifyContent="flex-start"
    >
      <YStack alignItems="center" marginBottom="$4">
        <Title>Welcome Back</Title>
        <Paragraph color="$color9">Sign in to continue</Paragraph>
      </YStack>

      <Form width="100%" gap="$3" onSubmit={handleSignIn}>
        <StyledInput placeholder="Email" size="$4" />
        <StyledInput placeholder="Password" size="$4" secureTextEntry />
        <XStack justifyContent="flex-end" marginTop="$2">
          <Link fontSize="$3" onPress={() => router.push('/forgot-password')}>
            Forgot Password?
          </Link>
        </XStack>

        <Form.Trigger asChild>
          <StyledButton
            theme="accent"
            size="$4"
            onPress={handleSignIn}
            marginTop="$3"
          >
            Sign In
          </StyledButton>
        </Form.Trigger>
      </Form>

      <Separator width="100%" marginVertical="$4" />

      <StyledButton
        theme="secondary"
        variant="outlined"
        size="$4"
        width="100%"
        marginTop="$4"
      >
        Sign In with Google
      </StyledButton>

      <XStack justifyContent="center" alignItems="baseline" space="$2" marginTop="$4">
        <Paragraph fontSize="$3">Don't have an account?</Paragraph>
        <Link fontSize="$3" onPress={() => router.push('/register')}>
          Sign Up
        </Link>
      </XStack>
    </YStack>
  )
} 