import { AudioLines, Mic } from '@tamagui/lucide-icons';
import { XStack, Text, Card, Button, Square } from 'tamagui';
import { useEffect, useState } from 'react';
import Animated, { withTiming, useSharedValue, Easing } from 'react-native-reanimated';
import './search-input.css';

export function SearchInput({ workspace }: { workspace: string }) {
  const [isRecording, setIsRecording] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isTextareaFocused, setIsTextareaFocused] = useState(false);

  const defaultHeight = 140;
  const expandedHeight = defaultHeight * 1.5;
  const height = useSharedValue(defaultHeight);

  // Expand if either recording or textarea is focused
  const isExpanded = isRecording || isTextareaFocused;

  useEffect(() => {
    height.value = withTiming(isExpanded ? expandedHeight : defaultHeight, { duration: 150, easing: Easing.bezier(0.25, 0.1, 0.25, 1.0) });
  }, [isExpanded]);

  return (
    <Animated.View
      style={{
        height,
        width: '100%',
      }}
    >
      <Card
        theme={'accent'}
        elevation={10}
        size="$3"
        bordered
        height="100%"
        width="100%"
        shadowColor="$shadow3"
        shadowRadius={10}
        padding="$4"
      >
        <Card.Header paddingHorizontal="0">
          <XStack flex={1} justifyContent="center" alignItems="center" gap="$2">
            {isRecording ? (
              <Text fontSize="$5" fontFamily="$heading">
                Recording...
              </Text>
            ) : (
              <textarea
                placeholder="Ask anything from your notes"
                className="search-textarea"
                onFocus={() => setIsTextareaFocused(true)}
                onBlur={() => setIsTextareaFocused(false)}
              />
            )}
          </XStack>
        </Card.Header>
        <Card.Footer>
          <XStack flex={1} justifyContent="space-between" alignItems="center">
            <Text theme={'accent'} fontSize="$3" fontFamily="$body">
              Workspace: {workspace}
            </Text>
            <XStack alignItems="center" gap="$2">
              <Button
                chromeless
                padding={'$2'}
                variant="outlined"
                borderRadius={'$10'}
                width={40}
                height={40}
                onPress={() => setIsRecording(!isRecording)}
              >
                {isRecording ? (
                  <Square size={12} backgroundColor="#fff" borderRadius='$1' />
                ) : (
                  <Mic size={20} />
                )}
              </Button>
              <Button
                chromeless
                padding={'$2'}
                variant="outlined"
                borderRadius={'$10'}
                width={40}
                height={40}
                onPress={() => setIsVoiceMode(!isVoiceMode)}
              >
                <AudioLines size={20} />
              </Button>
            </XStack>
          </XStack>
        </Card.Footer>
      </Card>
    </Animated.View>
  );
}
