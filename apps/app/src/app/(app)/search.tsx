import { YStack, Text, Button, XStack, ScrollView } from 'tamagui';
import { StyledInput, Title } from '../../components/ui/Themed';
import { Send } from '@tamagui/lucide-icons';
import { useState } from 'react';
import { useRef } from 'react';


const MOCK_MESSAGES = [
  { id: 1, sender: 'ai', text: 'Hello! How can I help you today?' },
  { id: 2, sender: 'user', text: 'What is the weather like in Paris?' },
];


export default function Search() {
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);

  return (
    <YStack flex={1} backgroundColor="$background">
      <ScrollView
        ref={scrollRef}
        flex={1}
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
            <Text fontFamily="$body" color="$color11" fontSize="$3">
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
        borderColor="$background"
        alignItems="center"
        gap="$3"
      >
        <StyledInput
          flex={1}
          size="$4"
          placeholder="Type your message..."
          value={input}
          onChangeText={setInput}
        />
        <Button
          size="$4"
          backgroundColor="$accent1"
          icon={<Send color="white" size={20} />}
          aria-label="Send"
          disabled={!input.trim()}
        />
      </XStack>
    </YStack>
  );
} 