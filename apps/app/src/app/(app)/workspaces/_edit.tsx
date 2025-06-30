import { Workspace } from '@auto-note-workspace/shared';
import { StyledInput, StyledTextArea } from '../../../components/ui/Themed';
import { Button, Form, YStack, Text, Spinner } from 'tamagui';
import { useState } from 'react';
import { useSheet } from '../../../contexts/SheetContext';

interface WorkspaceEditProps {
    workspace: Workspace;
    save: (workspace: Workspace) => void;   
}

export default function WorkspaceEdit({ workspace, save }: WorkspaceEditProps) {
    const { data } = useSheet();
    const [name, setName] = useState(workspace.name);
    const [description, setDescription] = useState(workspace.description ?? '');

  return (
    <YStack flex={1} justifyContent="space-between">
      <Form gap="$3">
        <Text marginBottom="$3" fontSize="$4" fontFamily="$heading">Edit Workspace</Text>
        <StyledInput placeholder="Workspace name" value={name} onChangeText={setName} />
        <StyledTextArea
          placeholder="Workspace description"
          value={description}
          onChangeText={setDescription}
        />
      </Form>
      <Button onPress={() => save({ ...workspace, name, description })} disabled={data?.isPending}>
        {data?.isPending ? <Spinner size="small" color="$color10" /> : 'Save'}
      </Button>
    </YStack>
  );
}
