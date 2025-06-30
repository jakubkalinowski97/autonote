import { GestureResponderEvent, ViewStyle } from 'react-native';
import { Card, XStack, H4, Paragraph, Button, Text, Spinner } from 'tamagui';

interface WorkspaceCardProps {
  title: string;
  count: number;
  action: () => void;
  isActionLoading: boolean;
  style?: ViewStyle;
  isActive: boolean;
  onPress: () => void;
}

export function WorkspaceCard({
  title,
  count,
  action,
  isActionLoading,
  style,
  isActive,
  onPress,
}: WorkspaceCardProps) {
  const handleAction = (e: GestureResponderEvent) => {
    e.stopPropagation();
    action();
  };
  return (
    <Card
      theme={isActive ? 'accent' : ''}
      elevation={4}
      size="$4"
      bordered
      style={style}
      shadowColor="$shadow3"
      shadowRadius={8}
      onPress={onPress}
      height='200px'
    >
      <Card.Header padded>
        <XStack alignItems="center" gap="$2">
          <H4 numberOfLines={2}>{title}</H4>
        </XStack>
        <Paragraph>{count > 10 ? 'Notes: ' + count : 'No notes yet'}</Paragraph>
      </Card.Header>
      <Card.Footer padded>
        <XStack width="100%" alignItems="center" justifyContent="flex-end">
          {!isActive ? (
            <Button width="100px" borderRadius="$4" onPress={handleAction} disabled={isActionLoading}>
              {isActionLoading ? <Spinner color="$color10" size="small" /> : 'Select'}
            </Button>
          ) : (
            <Button width="100px" disabled borderRadius="$4" theme="accent">
              Selected
            </Button>
          )}
        </XStack>
      </Card.Footer>
    </Card>
  );
}
