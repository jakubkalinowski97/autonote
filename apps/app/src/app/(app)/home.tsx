import { XStack, ScrollView } from 'tamagui';
import { StyledInput, Subtitle } from '../../components/ui/Themed';
import NoteCard from '../../components/cards/NoteCard';
import { WorkspaceCard } from '../../components/cards/WorkspaceCard';
import { AnimatedScreen } from '../../components/ui/AnimatedScreen';

interface Note {
  id: string;
  title: string;
  category: string;
  workspace: string;
  date: string;
  type: 'text' | 'image' | 'audio';
}

interface Workspace {
  id: string;
  title: string;
  count: number;
  isActive: boolean;
}

const MOCK_WORKSPACES: Workspace[] = [
  { id: '1', title: 'Work', count: 12, isActive: true },
  { id: '2', title: 'Personal', count: 5, isActive: false },
  { id: '3', title: 'Ideas', count: 8, isActive: false },
  { id: '4', title: 'Archive', count: 2, isActive: false },
];

const MOCK_NOTES: Note[] = [
  {
    id: '1',
    title: 'UI Review',
    category: 'Design',
    workspace: 'Work',
    date: '2024-06-07',
    type: 'text',
  },
  {
    id: '2',
    title: 'Grocery List',
    category: 'Personal',
    workspace: 'Home',
    date: '2024-06-06',
    type: 'audio',
  },
  {
    id: '3',
    title: 'Sprint Planning',
    category: 'Meetings',
    workspace: 'Work',
    date: '2024-06-05',
    type: 'text',
  },
  {
    id: '4',
    title: 'Recipe: Avocado Toast',
    category: 'Cooking',
    workspace: 'Home',
    date: '2024-06-04',
    type: 'image',
  },
];

export default function HomeScreen() {
  return (
    <AnimatedScreen>
      <ScrollView>
        <XStack flex={1} backgroundColor="$background" paddingVertical="$4" flexDirection="column">
          <StyledInput size="$5" placeholder="Research notes..." />
          <XStack paddingVertical="$6" gap="$4" flexDirection="column">
            <Subtitle size="$5" color="$color10">
              Last notes
            </Subtitle>
            <ScrollView horizontal>
              <XStack gap="$4" flex={1}>
                {MOCK_NOTES.map((note) => (
                  <NoteCard
                    key={note.id}
                    title={note.title}
                    description={note.category}
                    type={note.type}
                    action={() => {
                      return;
                    }}
                  />
                ))}
              </XStack>
            </ScrollView>
          </XStack>
          <XStack paddingVertical="$6" gap="$4" flexDirection="column">
            <Subtitle size="$5" color="$color10">
              Workspaces
            </Subtitle>
            <ScrollView horizontal>
              <XStack gap="$4" flex={1}>
                {MOCK_WORKSPACES.map((workspace) => (
                  <WorkspaceCard
                    key={workspace.id}
                    title={workspace.title}
                    count={workspace.count}
                    isActive={workspace.isActive}
                    action={() => {
                      return;
                    }}
                  />
                ))}
              </XStack>
            </ScrollView>
          </XStack>
        </XStack>
      </ScrollView>
    </AnimatedScreen>
  );
}
