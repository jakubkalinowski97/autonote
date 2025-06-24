import { ViewStyle } from 'react-native';
import { Card, XStack, H4, Paragraph, Button, Text } from 'tamagui';

interface WorkspaceCardProps {
  title: string;
  count: number;
  action: () => void;
  style?: ViewStyle;
  isActive: boolean;
}

export function WorkspaceCard({
  title,
  count,
  action,
  style,
  isActive,
}: WorkspaceCardProps) {
  return (
    <Card
      theme={isActive ? 'accent' : ''}
      elevate
      size="$4"
      bordered
      width={200}
      style={style}
    >
      <Card.Header padded>
        <XStack alignItems="center" gap="$2">
          <H4>{title}</H4>
        </XStack>
        <Paragraph theme="alt2">Notes: {count}</Paragraph>
      </Card.Header>
      <Card.Footer padded>
        <XStack width="100%" alignItems="center" justifyContent="flex-end">
          {!isActive && (
            <Button borderRadius="$10" onPress={action}>
              Select
            </Button>
          )}
        </XStack>
      </Card.Footer>
    </Card>
  );
}
