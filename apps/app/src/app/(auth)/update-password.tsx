import { useRouter } from 'expo-router';
import { Form, YStack } from 'tamagui';
import { useAuth } from '../../contexts/AuthContext';
import React, { useState } from 'react';
import { Title, Paragraph, StyledButton, StyledInput } from '../../components/ui/Themed';

export default function UpdatePassword() {
  const router = useRouter();
  const { updatePassword, loading, error } = useAuth();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handlePasswordUpdate = async () => {
    setFormError(null);
    if (newPassword !== confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }
    try {
      await updatePassword(newPassword);
      setSuccess(true);
      setTimeout(() => router.replace('/home'), 1500);
    } catch (e: any) {
      setFormError(e?.message || 'Password update failed');
    }
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
        <StyledInput
          placeholder="New Password"
          size="$4"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <StyledInput
          placeholder="Confirm New Password"
          size="$4"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        {formError || error ? (
          <Paragraph color="$red10" marginTop="$2">{formError || error}</Paragraph>
        ) : null}
        {success ? (
          <Paragraph color="$green10" marginTop="$2">Password updated! Redirecting...</Paragraph>
        ) : null}

        <Form.Trigger asChild>
          <StyledButton theme="accent" size="$4" marginTop="$4" onPress={handlePasswordUpdate} disabled={loading}>
            {loading ? 'Updating...' : 'Update Password & Sign In'}
          </StyledButton>
        </Form.Trigger>
      </Form>
    </YStack>
  );
} 