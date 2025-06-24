import { Button, H4, Paragraph, XStack } from 'tamagui';
import { Card } from 'tamagui';
import { AudioLines, FileImage, LetterText } from '@tamagui/lucide-icons';

const TYPE_ICONS = {
  text: LetterText,
  image: FileImage,
  audio: AudioLines,
};

export default function NoteCard({
  title,
  description,
  action,
  type,
}: {
  title: string;
  description: string;
  action: () => void;
  type: 'text' | 'image' | 'audio';
}) {
  const Icon = TYPE_ICONS[type];
  return (
    <Card elevate size="$4" bordered width={200}>
      <Card.Header padded>
        <XStack alignItems="center" gap="$2">
          <H4>{title}</H4>
        </XStack>
        <Paragraph theme="alt2">{description}</Paragraph>
      </Card.Header>
      <Card.Footer padded>
        <XStack width='100%' alignItems="center" justifyContent="space-between">
          <Icon size="$1" color="$color10" />
          <Button borderRadius="$10" onPress={action}>Open</Button>
        </XStack>
      </Card.Footer>
    </Card>
  );
}
