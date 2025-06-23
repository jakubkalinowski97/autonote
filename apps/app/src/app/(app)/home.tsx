import { useState, useRef } from 'react';
import { YStack, XStack, Input, Button, ScrollView, Text } from 'tamagui';
import { Send } from '@tamagui/lucide-icons';

const MOCK_MESSAGES = [
  { id: 1, sender: 'ai', text: 'Hello! How can I help you today?' },
  { id: 2, sender: 'user', text: 'What is the weather like in Paris?' },
];

export default function HomeScreen() {
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);

  return (
    <YStack flex={1} backgroundColor="$color2">
      <ScrollView
        ref={scrollRef}
        flex={1}
        padding="$4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        {messages.map((msg) => (
          <YStack
            key={msg.id}
            alignSelf={msg.sender === 'user' ? 'flex-end' : 'flex-start'}
            backgroundColor={msg.sender === 'user' ? '$accent10' : '$color4'}
            borderRadius="$6"
            marginBottom="$3"
            paddingHorizontal="$4"
            paddingVertical="$3"
            maxWidth="80%"
            shadowColor="$shadow1"
            shadowRadius={4}
          >
            <Text fontFamily="$body" color="$color11" fontSize="$5">
              {msg.text}
            </Text>
          </YStack>
        ))}
      </ScrollView>
      <XStack
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        padding="$4"
        borderTopWidth={1}
        borderColor="$color2"
        alignItems="center"
        gap="$3"
      >
        <Input
          flex={1}
          size="$4"
          borderRadius="$8"
          backgroundColor="$color2"
          placeholder="Type your message..."
          value={input}
          onChangeText={setInput}
          fontFamily="$body"
        />
        <Button
          size="$4"
          borderRadius="$8"
          backgroundColor="$accent1"
          icon={<Send color="white" size={20} />}
          aria-label="Send"
          disabled={!input.trim()}
        />
      </XStack>
    </YStack>
  );
}
