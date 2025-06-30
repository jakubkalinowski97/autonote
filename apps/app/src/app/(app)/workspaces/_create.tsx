import { WorkspaceInsert } from '@auto-note-workspace/shared';
import { StyledInput, StyledTextArea } from '../../../components/ui/Themed';
import { Button, Form, YStack, Text, Spinner } from 'tamagui';
import { useState } from 'react';
import { useSheet } from '../../../contexts/SheetContext';
import { CheckboxWithLabel } from '../../../components/ui/Checkbox';

export default function WorkspaceCreate({createWorkspace}: {createWorkspace: (workspace: WorkspaceInsert) => void}) {
  const { data } = useSheet();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isTeam, setIsTeam] = useState(false);

  return (
    <YStack flex={1} justifyContent="space-between">
      <Form gap="$3">
        <Text marginBottom="$3" fontSize="$4" fontFamily="$heading">
          new workspace
        </Text>
        <StyledInput
          placeholder="workspace name"
          value={name}
          onChangeText={setName}
        />
        <StyledTextArea
          placeholder="workspace description"
          value={description}
          onChangeText={setDescription}
        />
        <CheckboxWithLabel size="$4" value={isTeam.toString()} onCheckedChange={() => setIsTeam(!isTeam)} label="share with team" />
      </Form>
      <Button
        onPress={() => {
          createWorkspace({
            name,
            description,
            is_team: isTeam,
          });
        }}
        disabled={data?.isPending}
      >
        {data?.isPending ? <Spinner size="small" color="$color10" /> : 'Create'}
      </Button>
    </YStack>
  );
}
