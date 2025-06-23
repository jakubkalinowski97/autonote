import { useRouter } from 'expo-router';
import { Button, Form, Input, Separator, YStack, XStack } from 'tamagui';
import { useAuth } from '../../contexts/AuthContext';
import { Title, Paragraph, Link } from '../../components/ui/Themed';

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();

  const handleSignIn = () => {
    // Perform login logic here (e.g., API call)
    // On success, call the login function from the context
    login();
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
        <Paragraph color="$color10">Sign in to continue</Paragraph>
      </YStack>

      <Form width="100%" gap="$3" onSubmit={handleSignIn}>
        <Input placeholder="Email" size="$4" />
        <Input placeholder="Password" size="$4" secureTextEntry />
        <XStack justifyContent="flex-end" marginTop="$2">
          <Link onPress={() => router.push('/forgot-password')}>
            Forgot Password?
          </Link>
        </XStack>

        <Form.Trigger asChild>
          <Button theme="accent" size="$4" onPress={handleSignIn} marginTop="$3">
            Sign In
          </Button>
        </Form.Trigger>
      </Form>

      <Separator width="100%" marginVertical="$4" />

      <Button
        theme="accent"
        variant="outlined"
        size="$4"
        width="100%"
      >
        Sign In with Google
      </Button>

      <XStack justifyContent="center" alignItems="baseline" space="$2" marginTop="$4">
        <Paragraph>Don't have an account?</Paragraph>
        <Link onPress={() => router.push('/register')}>
          Sign Up
        </Link>
      </XStack>
    </YStack>
  )
} 