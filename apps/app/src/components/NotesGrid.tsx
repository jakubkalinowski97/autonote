import { Stack } from 'tamagui';
import { NoteCardCompact } from './cards/NoteCardCompact';

interface Note {
  id: string;
  title: string;
  category: string;
  workspace: string;
  type: 'text' | 'audio' | 'image';
  date: string;
  fileSize: string;
}

export function NotesGrid({ notes }: { notes: Note[] }) {
  return (
    <div
      style={{
        width: '100%',
        gap: '20px',
        padding: '16px 0',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
      }}
    >
      {notes.map((note, index) => (
        <Stack key={note.id} gridColumnStart={(index % 3) + 1}>
          <NoteCardCompact
            title={note.title}
            workspace={note.workspace}
            type={note.type}
            date={note.date}
            onPress={() => {
              /* handle open note */
            }}
          />
        </Stack>
      ))}
    </div>
  );
} 