import { YStack, Text, Stack } from 'tamagui';
import { Card } from 'tamagui';
import { AudioWaveform, FileImage, LetterText } from '@tamagui/lucide-icons';

const TYPE_ICONS = {
  text: LetterText,
  image: FileImage,
  audio: AudioWaveform,
};

const TYPE_COLORS = {
  text: '#FEF7FA',
  image: '#FFFCF5',
  audio: '#F5FCFA',
};

const TYPE_ICON_COLORS = {
  text: '#F06292',
  image: '#FFB300',
  audio: '#26A69A',
};

export function NoteCardCompact({
  title,
  workspace,
  type,
  date,
  onPress,
}: {
  title: string;
  workspace: string;
  type: 'text' | 'audio' | 'image';
  date: string;
  onPress: () => void;
}) {
  const Icon = TYPE_ICONS[type];
  return (
    <YStack>
      <Card
        elevation={4}
        bordered
        shadowColor="$shadow3"
        shadowRadius={8}
        onPress={onPress}
        aspectRatio={1}
        backgroundColor={TYPE_COLORS[type]}
        borderWidth={0}
      >
        <Stack alignItems="center" justifyContent="center" flex={1}>
          <Icon size="$1" color={TYPE_ICON_COLORS[type]} />
        </Stack>
      </Card>
      <YStack paddingTop="$2">
        <Text
          numberOfLines={1}
          fontSize="$4"
          fontFamily="$heading"
          fontWeight="bold"
          color="$color10"
        >
          {title}
        </Text>
        <Text
          numberOfLines={1}
          fontSize="$3"
          fontFamily="$body"
          color="$color10"
        >
          {workspace}
        </Text>
        <Text
          numberOfLines={1}
          fontSize="$3"
          fontFamily="$body"
          color="$color10"
        >
          {date}
        </Text>
      </YStack>
    </YStack>
  );
}
