import { YStack, ScrollView, XStack } from 'tamagui';
import { WorkspaceCard } from '../../components/cards/WorkspaceCard';
import { AnimatedScreen } from '../../components/ui/AnimatedScreen';

const MOCK_WORKSPACES= [
  { id: '1', title: 'Work', count: 12, isActive: true },
  { id: '2', title: 'Personal', count: 5, isActive: false },
  { id: '3', title: 'Ideas', count: 8, isActive: false },
  { id: '4', title: 'Archive', count: 2, isActive: false },
];

function chunkArray(array: any[], size: number) {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

export default function Workspaces() {
  const rows = chunkArray(MOCK_WORKSPACES, 2);

  return (
    <AnimatedScreen>
      <YStack flex={1}>
        <ScrollView flex={1}>
          <YStack gap="$4">
            {rows.map((pair, idx) => (
              <XStack key={idx} gap="$4">
                {pair.map((ws) => (
                  <WorkspaceCard
                    key={ws.title}
                    title={ws.title}
                    count={ws.count}
                    isActive={ws.isActive}
                    style={{ flex: 1, minWidth: 0 }}
                    action={() => {
                      return;
                    }}
                  />
                ))}
                {pair.length === 1 && <YStack flex={1} minWidth={0} />}
              </XStack>
            ))}
          </YStack>
        </ScrollView>
      </YStack>
    </AnimatedScreen>
  );
} 