import { Button, H4, Paragraph, XStack, Text } from 'tamagui';
import { Card } from 'tamagui';
import { AudioWaveform, FileImage, LetterText } from '@tamagui/lucide-icons';

const TYPE_ICONS = {
  text: LetterText,
  image: FileImage,
  audio: AudioWaveform,
};

export function NoteCard({
  title,
  workspace,
  date,
  action,
  type,
}: {
  title: string;
  workspace: string;
  date: string;
  action: () => void;
  type: 'text' | 'image' | 'audio';
}) {
  const Icon = TYPE_ICONS[type];
  return (
    <Card elevation={4} size="$4" bordered width={200} shadowColor="$shadow3" shadowRadius={8}>
      <Card.Header padded>
        <XStack alignItems="center" gap="$2">
          <H4 numberOfLines={3}>{title}</H4>
        </XStack>
        <Paragraph theme="alt2">{workspace}</Paragraph>
        <Text paddingTop="$1" fontSize="$3" fontFamily="$body" color="$color10">{date}</Text>
      </Card.Header>
      <Card.Footer padded>
        <XStack width='100%' alignItems="center" justifyContent="space-between">
          <Icon size="$1" color="$color10" />
          <Button borderRadius="$4" onPress={action}>
            {type === 'audio' ? 'Play' : 'Preview'}
          </Button>
        </XStack>
      </Card.Footer>
    </Card>
  );
}
