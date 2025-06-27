import { useRouter } from 'expo-router';
import { Form, Separator, YStack, XStack } from 'tamagui';
import { useAuth } from '../../contexts/AuthContext';
import React, { useState } from 'react';
import {
  Title,
  Paragraph,
  Link,
  StyledButton,
  StyledInput,
} from '../../components/ui/Themed';
import { AnimatedScreen } from '../../components/ui/AnimatedScreen';

export default function Register() {
  const router = useRouter();
  const { register, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');

  const handleSignUp = async () => {
    try {
      await register(email, password, name);
      router.replace('/registration-success');
    } catch (e: any) {
      console.log(e.message);
    }
  };

  return (
    <AnimatedScreen>
      <YStack flex={1}>
        <YStack alignItems="center" marginBottom="$4">
          <Title>Create Account</Title>
          <Paragraph color="$color9">Start your journey with us</Paragraph>
        </YStack>

        <Form width="100%" gap="$3" onSubmit={handleSignUp}>
          <StyledInput
            placeholder="Name"
            size="$4"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
          <StyledInput
            placeholder="Email"
            size="$4"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
          <StyledInput
            placeholder="Password"
            size="$4"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <StyledInput
            placeholder="Confirm Password"
            size="$4"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <Form.Trigger asChild>
            <StyledButton
              theme="accent"
              size="$4"
              marginTop="$4"
              disabled={loading}
            >
              {loading ? 'Signing Up...' : 'Sign Up'}
            </StyledButton>
          </Form.Trigger>
        </Form>

        <Separator width="100%" marginVertical="$4" />

        <XStack
          justifyContent="center"
          alignItems="baseline"
          space="$2"
          marginTop="$4"
        >
          <Paragraph fontSize="$3">Already have an account?</Paragraph>
          <Link fontSize="$3" onPress={() => router.push('/login')}>
            Sign In
          </Link>
        </XStack>
      </YStack>
    </AnimatedScreen>
  );
}
