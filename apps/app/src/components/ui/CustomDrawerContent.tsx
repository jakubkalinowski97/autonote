import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import {
  YStack,
  XStack,
  Separator,
  Avatar,
  Text,
  Switch,
} from 'tamagui';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme as useAppTheme } from '../../contexts/ThemeContext';
import { useRouter } from 'expo-router';
import { User, Moon, Sun } from '@tamagui/lucide-icons';
import { useTheme } from 'tamagui';

export function CustomDrawerContent(props: any) {
  const { user, logout } = useAuth();
  const { theme: appTheme, toggleTheme } = useAppTheme();
  const router = useRouter();
  const tamaguiTheme = useTheme();

  if (!tamaguiTheme) {
    return null;
  }

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      <YStack>
        <YStack padding="$4" alignItems="center">
          <Avatar circular size="$6">
            <User size="$4" />
            <Avatar.Fallback backgroundColor="$gray8" />
          </Avatar>
          <Text marginTop="$2" fontSize="$5" fontWeight="bold">
            {user?.email}
          </Text>
        </YStack>
        <Separator marginBottom={'$4'} />
        <DrawerItemList {...props} />
      </YStack>

      <YStack flex={1} />

      <YStack paddingBottom="$4">
        <Separator marginBottom={'$4'} />
        <DrawerItem label="Settings" onPress={() => router.push('/settings')} />
        <DrawerItem label="Logout" onPress={logout} />
        <DrawerItem
          label={appTheme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          onPress={toggleTheme}
          icon={({ color, size }) =>
            appTheme === 'dark' ? (
              <Sun color={color} size={size} />
            ) : (
              <Moon color={color} size={size} />
            )
          }
          inactiveTintColor={tamaguiTheme.gray12?.val}
        />
      </YStack>
    </DrawerContentScrollView>
  );
}
 