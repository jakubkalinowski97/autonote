import { Drawer } from 'expo-router/drawer';
import { CustomDrawerContent } from './components/ui/CustomDrawerContent';
import { HeaderTitle } from './components/ui/Themed';
import { useEffect } from 'react';
import { storage } from './utils/storage';

function useWebOAuthHandler() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const fragment = window.location.hash.substring(1);
      const params = new URLSearchParams(fragment);
      const accessToken = params.get('access_token');
      if (accessToken) {
        storage.setItem('jwt', accessToken);
        window.location.hash = '';
      }
    }
  }, []);
}

export default function AppLayout() {
  useWebOAuthHandler();

  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerTitle: (props) => <HeaderTitle>{props.children}</HeaderTitle>,
      }}
    >
      <Drawer.Screen name="home" options={{ title: 'Home' }} />
      <Drawer.Screen name="notes" options={{ title: 'Notes' }} />
      <Drawer.Screen name="workspaces" options={{ title: 'Workspaces' }} />
      <Drawer.Screen name="search" options={{ title: 'Search' }} />
      <Drawer.Screen
        name="settings"
        options={{
          title: 'Settings',
          drawerItemStyle: { display: 'none' },
        }}
      />
    </Drawer>
  );
} 