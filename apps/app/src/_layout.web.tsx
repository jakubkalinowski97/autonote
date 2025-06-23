import { Drawer } from 'expo-router/drawer';
import { CustomDrawerContent } from './components/ui/CustomDrawerContent';
import { HeaderTitle } from './components/ui/Themed';

export default function AppLayout() {

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