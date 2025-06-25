import { useRouter } from 'expo-router';
import { Form, YStack } from 'tamagui';
import { useAuth } from '../../contexts/AuthContext';
import React, { useState } from 'react';
import { Title, Paragraph, Link, StyledButton, StyledInput } from '../../components/ui/Themed';

export default function ForgotPassword() {
  const router = useRouter();
  const { requestPasswordReset, loading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handlePasswordResetRequest = async () => {
    setFormError(null);
    try {
      await requestPasswordReset(email);
      setSuccess(true);
    } catch (e: any) {
      setFormError(e?.message || 'Password reset failed');
    }
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
        <StyledInput
          placeholder="Email"
          size="$4"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        {formError || error ? (
          <Paragraph color="$red10" marginTop="$2">{formError || error}</Paragraph>
        ) : null}
        {success ? (
          <Paragraph color="$green10" marginTop="$2">If an account exists, a password reset link has been sent.</Paragraph>
        ) : null}

        <Form.Trigger asChild>
          <StyledButton theme="accent" size="$4" marginTop="$4" onPress={handlePasswordResetRequest} disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
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