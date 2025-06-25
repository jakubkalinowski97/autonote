import {
  Sheet,
  YStack,
  XStack,
  Button,
  Text,
  Select,
  Input,
  H4,
} from 'tamagui';
import { useState } from 'react';
import { Title } from './ui/Themed';
import { X } from '@tamagui/lucide-icons';

const NOTE_TYPES = [
  { label: 'All', value: '' },
  { label: 'Text', value: 'text' },
  { label: 'Audio', value: 'audio' },
  { label: 'Image', value: 'image' },
];

export interface NotesFilter {
  type: string;
  workspace: string;
  category: string;
  date: string;
}

export function NotesFilterSheet({
  open,
  onOpenChange,
  filters,
  setFilters,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: NotesFilter;
  setFilters: (filters: NotesFilter) => void;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange} snapPoints={[80, 10]} modal={false} dismissOnSnapToBottom zIndex={100}>
      <Sheet.Handle backgroundColor="#fff"/>
      <Sheet.Frame backgroundColor="#fff" padding="$4" gap="$4">
        <XStack justifyContent="space-between" alignItems="center">
          <H4 fontWeight="bold" fontSize="$6">
            filter notes
          </H4>
          <Button
            chromeless
            padding={'$2'}
            borderRadius={'$10'}
            width={40}
            height={40}
            onPress={() => onOpenChange(false)}
          >
            <X size={20} />
          </Button>
        </XStack>

        <YStack gap="$3">
          <XStack alignItems="center" gap="$2">
            
          </XStack>
        </YStack>
        <Button onPress={() => onOpenChange(false)}>Apply</Button>
      </Sheet.Frame>
    </Sheet>
  );
}
