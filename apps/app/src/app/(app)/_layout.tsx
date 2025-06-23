import { Tabs } from 'expo-router';
import { Home, Notebook, Plus, Rows, Settings } from '@tamagui/lucide-icons';
import { useTheme, YStack } from 'tamagui';
import { Pressable } from 'react-native';
import { HeaderTitle } from '../../components/ui/Themed';

export default function AppLayout() {
  const theme = useTheme();

  if (!theme) {
    return null; // or a loading indicator
  }

  return (
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: theme.accent3?.val,
          tabBarInactiveTintColor: theme.gray10?.val,
          tabBarStyle: {
            backgroundColor: theme.background?.val,
            height: 75,
            padding: 10,
            borderWidth: 1,
            borderColor: theme.color2?.val,
          },
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: theme.color2?.val,
          },
          sceneStyle: {
            paddingBottom: 10,
            backgroundColor: theme.color2?.val,
          },
          headerTitle: (props) => <HeaderTitle size="$7" color={theme.color11?.val}>{props.children}</HeaderTitle>,
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <Home color={color} size={28}/>,
          }}
        />
        <Tabs.Screen
          name="notes"
          options={{
            title: 'Notes',
            tabBarIcon: ({ color }) => <Notebook color={color} size={28} />,
          }}
        />
        <Tabs.Screen
          name="new-note"
          options={{
            title: 'New Note',
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

                  borderColor={theme.background?.val}
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
            title: 'Workspaces',
            tabBarIcon: ({ color }) => <Rows color={color} size={28} />,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color }) => <Settings color={color} size={28} />,
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            href: null,
          }}
        />
      </Tabs>
  );
} 