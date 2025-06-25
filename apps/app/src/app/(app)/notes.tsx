import { YStack, XStack, ScrollView, Button } from 'tamagui';
import { Subtitle } from '../../components/ui/Themed';
import { AnimatedScreen } from '../../components/ui/AnimatedScreen';
import { NoteCard } from '../../components/cards/NoteCard';
import { NotesGrid } from '../../components/notes/NotesGrid';
import {
  NotesFilterSheet,
  NotesFilter,
} from '../../components/notes/NotesFilterSheet';
import { useState } from 'react';
import { useFilterSheet } from '../../contexts/FilterSheetContext';

interface Note {
  id: string;
  title: string;
  category: string;
  workspace: string;
  type: 'text' | 'audio' | 'image';
  date: string;
  fileSize: string;
}

const MOCK_RECENT_NOTES = [
  {
    id: '1',
    title: 'UI Review',
    category: 'Design',
    workspace: 'Work',
    date: '2024-06-07',
    type: 'text',
    fileSize: '100kb',
  },
  {
    id: '2',
    title: 'Grocery List',
    category: 'Personal',
    workspace: 'Home',
    date: '2024-06-06',
    type: 'audio',
    fileSize: '1.2MB',
  },
  {
    id: '3',
    title: 'Sprint Planning',
    category: 'Meetings',
    workspace: 'Personal',
    date: '2024-06-05',
    type: 'text',
    fileSize: '100kb',
  },
  {
    id: '4',
    title: 'Recipe: Avocado Toast',
    category: 'Cooking',
    workspace: 'Home',
    date: '2024-06-04',
    type: 'image',
    fileSize: '2.4MB',
  },
];

const MOCK_NOTES = [
  {
    id: '1',
    title: 'UI Review',
    category: 'Design',
    workspace: 'Work',
    date: '2024-06-07',
    type: 'text',
    fileSize: '100kb',
  },
  {
    id: '2',
    title: 'Grocery List',
    category: 'Personal',
    workspace: 'Home',
    date: '2024-06-06',
    type: 'audio',
    fileSize: '1.2MB',
  },
  {
    id: '3',
    title: 'Sprint Planning',
    category: 'Meetings',
    workspace: 'Personal',
    date: '2024-06-05',
    type: 'text',
    fileSize: '100kb',
  },
  {
    id: '4',
    title: 'Recipe: Avocado Toast',
    category: 'Cooking',
    workspace: 'Home',
    date: '2024-06-04',
    type: 'image',
    fileSize: '2.4MB',
  },
  {
    id: '5',
    title: 'Project Roadmap',
    category: 'Work',
    workspace: 'Work',
    date: '2024-06-03',
    type: 'text',
    fileSize: '80kb',
  },
  {
    id: '6',
    title: 'Voice Memo: Ideas',
    category: 'Personal',
    workspace: 'Personal',
    date: '2024-06-02',
    type: 'audio',
    fileSize: '900kb',
  },
  {
    id: '7',
    title: 'Travel Checklist',
    category: 'Travel',
    workspace: 'Personal',
    date: '2024-06-01',
    type: 'text',
    fileSize: '60kb',
  },
  {
    id: '8',
    title: 'Meeting Notes: Q2',
    category: 'Meetings',
    workspace: 'Work',
    date: '2024-05-31',
    type: 'text',
    fileSize: '120kb',
  },
  {
    id: '9',
    title: 'Photo: Whiteboard',
    category: 'Work',
    workspace: 'Work',
    date: '2024-05-30',
    type: 'image',
    fileSize: '3.1MB',
  },
  {
    id: '10',
    title: 'Book Summary: Atomic Habits',
    category: 'Reading',
    workspace: 'Personal',
    date: '2024-05-29',
    type: 'text',
    fileSize: '110kb',
  },
  {
    id: '11',
    title: 'Voice Memo: Shopping',
    category: 'Personal',
    workspace: 'Home',
    date: '2024-05-28',
    type: 'audio',
    fileSize: '1.1MB',
  },
  {
    id: '12',
    title: 'Recipe: Banana Bread',
    category: 'Cooking',
    workspace: 'Home',
    date: '2024-05-27',
    type: 'image',
    fileSize: '2.2MB',
  },
  {
    id: '13',
    title: 'Fitness Log',
    category: 'Health',
    workspace: 'Personal',
    date: '2024-05-26',
    type: 'text',
    fileSize: '70kb',
  },
  {
    id: '14',
    title: 'Workshop Notes',
    category: 'Learning',
    workspace: 'Work',
    date: '2024-05-25',
    type: 'text',
    fileSize: '90kb',
  },
  {
    id: '15',
    title: 'Photo: Garden',
    category: 'Personal',
    workspace: 'Home',
    date: '2024-05-24',
    type: 'image',
    fileSize: '2.8MB',
  },
];

export default function Notes() {
  const [open, setOpen] = useFilterSheet();
  const [filters, setFilters] = useState<NotesFilter>({
    type: '',
    workspace: '',
    category: '',
    date: '',
  });

  return (
    <AnimatedScreen>
      <ScrollView>
        <YStack
          flex={1}
          backgroundColor="$background"
          paddingVertical="$4"
          gap="$6"
          paddingTop="$4"
        >
          <XStack flexDirection="column">
            <Subtitle size="$5" color="$color10" paddingHorizontal="$5">
              Recently added
            </Subtitle>
            <ScrollView horizontal>
              <XStack
                gap="$4"
                paddingVertical="$3"
                flex={1}
                paddingHorizontal="$5"
              >
                {MOCK_RECENT_NOTES.map((note) => (
                  <NoteCard
                    key={note.id}
                    title={note.title}
                    workspace={note.workspace}
                    date={note.date}
                    type={note.type as 'text' | 'audio' | 'image'}
                    action={() => {
                      return;
                    }}
                  />
                ))}
              </XStack>
            </ScrollView>
          </XStack>
          <XStack flexDirection="column" paddingHorizontal="$5">
            <Subtitle size="$5" color="$color10">
              All notes
            </Subtitle>
            <NotesGrid notes={MOCK_NOTES as Note[]} />
          </XStack>
        </YStack>
      </ScrollView>
      <NotesFilterSheet
        open={open}
        onOpenChange={setOpen}
        filters={filters}
        setFilters={setFilters}
      />
    </AnimatedScreen>
  );
}
