import { useRouter } from 'expo-router';
import { Form, Separator, YStack, XStack, Spinner } from 'tamagui';
import { useAuth } from '../../contexts/AuthContext';
import React, { useState, useEffect } from 'react';
import {
  Title,
  Paragraph,
  Link,
  StyledButton,
  StyledInput,
} from '../../components/ui/Themed';

export default function Login() {
  const router = useRouter();
  const { login, loginWithGoogle, loading, error, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/home');
    }
  }, [isAuthenticated, router]);

  const handleSignIn = async () => {
    setFormError(null);
    try {
      await login(email, password);
      router.replace('/home');
    } catch (e: any) {
      setFormError(e?.message || 'Login failed');
    }
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
        <StyledInput
          placeholder="Email"
          size="$4"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <StyledInput
          placeholder="Password"
          size="$4"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <XStack justifyContent="flex-end" marginTop="$2">
          <Link fontSize="$3" onPress={() => router.push('/forgot-password')}>
            Forgot Password?
          </Link>
        </XStack>

        {formError || error ? (
          <Paragraph color="$red10" marginTop="$2">{formError || error}</Paragraph>
        ) : null}

        <Form.Trigger asChild>
          <StyledButton
            theme="accent"
            size="$4"
            marginTop="$3"
            disabled={loading}
          >
            {loading ? <Spinner size="small" /> : 'Sign In'}
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
        disabled={loading}
        onPress={loginWithGoogle}
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