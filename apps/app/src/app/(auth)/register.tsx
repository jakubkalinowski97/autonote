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

export default function Register() {
  const router = useRouter();
  const { register, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignUp = async () => {
    try {
      await register(email, password);
      router.replace('/login');
    } catch (e: any) {
      console.log(e.message);
    }
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
          <StyledButton theme="accent" size="$4" marginTop="$4" onPress={handleSignUp} disabled={loading}>
            {loading ? 'Signing Up...' : 'Sign Up'}
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