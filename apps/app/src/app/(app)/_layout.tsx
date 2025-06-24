import { Tabs } from 'expo-router';
import { Home, Notebook, Plus, Rows, Settings, ArrowLeft, Search } from '@tamagui/lucide-icons';
import { useTheme, YStack, Button } from 'tamagui';
import { Pressable } from 'react-native';
import { HeaderTitle } from '../../components/ui/Themed';
import { useRouter } from 'expo-router';

export default function AppLayout() {
  const theme = useTheme();
  const router = useRouter();

  if (!theme) {
    return null; // or a loading indicator
  }

  return (
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: theme.accent3?.val,
          tabBarInactiveTintColor: theme.gray10?.val,
          tabBarStyle: {
            backgroundColor: '#fff',
            height: 75,
            padding: 10,
            borderWidth: 1,
            borderColor: '#fff',
          },
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: theme.background?.val,
          },
          sceneStyle: {
            paddingHorizontal: 20,
            paddingTop: 16,
            backgroundColor: theme.background?.val,
          },
          headerTitle: (props) => <HeaderTitle size="$7" fontFamily="$heading" color={theme.color10?.val}>{props.children}</HeaderTitle>,
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: 'home',
            tabBarIcon: ({ color }) => <Home color={color} size={28} />,
          }}
        />
        <Tabs.Screen
          name="notes"
          options={{
            title: 'notes',
            tabBarIcon: ({ color }) => <Notebook color={color} size={28} />,
          }}
        />
        <Tabs.Screen
          name="new-note"
          options={{
            title: 'new note',
            tabBarButton: ({ onPress, accessibilityRole, accessibilityState, accessibilityLabel}) => (
              <Pressable
                onPress={onPress}
                accessibilityRole={accessibilityRole}
                accessibilityState={accessibilityState}
                accessibilityLabel={accessibilityLabel}
                style={{ position: 'absolute', left: '50%', transform: [{ translateX: -35 }], bottom: 10, zIndex: 1 }}
              >
                <YStack
                  alignItems="center"
                  justifyContent="center"
                  width={70}
                  height={70}
                  backgroundColor={theme.accent1?.val}
                  borderWidth={7}
                  borderColor="#fff"
                  borderRadius={35}
                  shadowColor={theme.accent10?.val}
                  shadowOffset={{ width: 0, height: 4 }}
                  shadowOpacity={0.25}
                  shadowRadius={8}
                  elevation={8}
                >
                  <Plus color="white" size={28} />
                </YStack>
              </Pressable>
            ),
          }}
        />
        <Tabs.Screen
          name="workspaces"
          options={{
            title: 'workspaces',
            tabBarIcon: ({ color }) => <Rows color={color} size={28} />,
          }}
        />
                <Tabs.Screen
          name="search"
          options={{
            title: 'search',
            tabBarStyle: { display: 'none' },
            tabBarIcon: ({ color }) => <Search color={color} size={28} />,
            headerLeft: () => (
              <Button
                chromeless
                size="$3"
                borderRadius="$8"
                backgroundColor="transparent"
                onPress={() => router.back()}
                icon={<ArrowLeft color={theme.accent10?.val} size={24} />}
                aria-label="Back"
              />
            ),
            headerTitle: '',
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            href: null,
            title: 'settings',
            tabBarIcon: ({ color }) => <Settings color={color} size={28} />,
          }}
        />
      </Tabs>
  );
} 