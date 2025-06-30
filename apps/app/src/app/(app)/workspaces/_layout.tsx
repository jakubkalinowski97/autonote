import { useTheme } from 'tamagui';
import { Stack } from 'expo-router';

export default function WorkspacesLayout() {
  const theme = useTheme();
  return (
    <Stack
      screenOptions={{
        contentStyle: {
          backgroundColor: theme.background?.val,
        },
        headerShown: true,
        headerTitle: 'workspaces',
        headerStyle: {
          backgroundColor: theme.background?.val,
        },
        headerTitleStyle: {
          fontFamily: '$heading',
          fontSize: 24,
          color: theme.color10?.val,
        },
      }}
    />
  );
}
