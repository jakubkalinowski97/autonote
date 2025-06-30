import {
  YStack,
  ScrollView,
  Text,
  XStack,
  Card,
  Button,
  Spinner,
} from 'tamagui';
import { AnimatedScreen } from '../../../components/ui/AnimatedScreen';
import { HeaderTitle, Paragraph } from '../../../components/ui/Themed';
import {
  Info,
  Users,
  Lock,
  Files,
  Pencil,
  Trash,
} from '@tamagui/lucide-icons';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import {
  getWorkspace,
  selectWorkspace,
  updateWorkspace,
  deleteWorkspace,
} from '../../../api/workspace';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../../contexts/AuthContext';
import React, { useLayoutEffect } from 'react';
import { useSheet } from '../../../contexts/SheetContext';
import WorkspaceEdit from './_edit';
import { Workspace } from '@auto-note-workspace/shared';
import { DialogTrigger } from '../../../components/ui/DialogTrigger';

export default function WorkspaceDetails() {
  const { openSheet, closeSheet, setData } = useSheet();
  const { user, refetchUser } = useAuth();
  const { id } = useLocalSearchParams();
  const queryClient = useQueryClient();


  const {
    data: workspace,
    isLoading,
    refetch: refetchWorkspace,
  } = useQuery({
    queryKey: ['workspace', id],
    queryFn: () => getWorkspace(id as string),
  });

  const { mutate: activateWorkspace } = useMutation({
    mutationFn: (workspaceId: string) => selectWorkspace(workspaceId),
    onSuccess: () => {
      refetchUser();
    },
  });

  const { mutate: updateWorkspaceMutation } = useMutation({
    mutationFn: (workspace: Workspace) => updateWorkspace(workspace),
    onSuccess: () => {
      refetchWorkspace();
      closeSheet();
      setData({ isPending: false });
    },
    onMutate: () => {
      setData({ isPending: true });
    },
  });

  const { mutate: deleteWorkspaceMutation } = useMutation({
    mutationFn: (workspaceId: string) => deleteWorkspace(workspaceId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      router.replace('/workspaces');
    },
  });
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <XStack>
          <Button
            chromeless
            backgroundColor="transparent"
            padding={'$2'}
            borderRadius={'$10'}
            width={40}
            height={40}
            marginRight="$2"
            onPress={() =>
              openSheet(
                <WorkspaceEdit
                  workspace={workspace as Workspace}
                  save={updateWorkspaceMutation}
                />
              )
            }
          >
            <Pencil size={20} />
          </Button>
          {user?.id === workspace?.owner_id &&
            user?.last_selected_workspace_id !== id && (
              <DialogTrigger
                title="Delete Workspace"
                description="Are you sure you want to delete this workspace?"
                onAccept={() => deleteWorkspaceMutation(id as string)}
                onCancel={() => {return; }}
                acceptText="Delete"
                cancelText="Cancel"
              >
                <Button
                  chromeless
                  backgroundColor="transparent"
                  padding={'$2'}
                  borderRadius={'$10'}
                  width={40}
                  height={40}
                  marginRight="$2"
                >
                  <Trash size={20} />
                </Button>
              </DialogTrigger>
            )}
        </XStack>
      ),
    });
  }, [navigation, workspace]);

  return (
    <AnimatedScreen>
      {isLoading ? (
        <YStack
          flex={1}
          justifyContent="center"
          alignItems="center"
          backgroundColor="$background"
        >
          <Spinner size="large" color="$color10" />
        </YStack>
      ) : (
        <YStack
          flex={1}
          paddingHorizontal="$5"
          paddingTop="$4"
          backgroundColor="$background"
        >
          <ScrollView>
            <YStack gap="$5">
              <HeaderTitle>{workspace?.name}</HeaderTitle>

              {/* Description */}
              <Paragraph fontFamily="$body" fontSize="$4">
                {workspace?.description}
              </Paragraph>
              {/* Summary Row */}
              <XStack gap="$3" alignItems="center" marginBottom="$2">
                {/* Type Pill */}
                <XStack
                  backgroundColor="$accent6"
                  borderRadius={16}
                  paddingVertical="$2"
                  paddingHorizontal="$3"
                  alignItems="center"
                  gap={6}
                >
                  {workspace?.is_team ? (
                    <XStack alignItems="center">
                      <Users color="$color1" size={16} marginRight="$2" />
                      <Text
                        fontFamily="$body"
                        color="$color1"
                        fontWeight="bold"
                        fontSize="$1"
                      >
                        Team
                      </Text>
                    </XStack>
                  ) : (
                    <XStack alignItems="center">
                      <Lock color="$color1" size={16} marginRight="$2" />
                      <Text
                        fontFamily="$body"
                        color="$color1"
                        fontWeight="bold"
                        fontSize="$1"
                      >
                        Private
                      </Text>
                    </XStack>
                  )}
                </XStack>
                <XStack
                  backgroundColor="$accent6"
                  borderRadius="$8"
                  paddingVertical="$2"
                  paddingHorizontal="$3"
                  alignItems="center"
                  gap="$2"
                >
                  <Files color="$color1" size={16} />
                  <Text
                    fontFamily="$body"
                    color="$color1"
                    fontWeight="bold"
                    fontSize="$1"
                  >
                    6 notes
                  </Text>
                </XStack>
              </XStack>

              {/* Info Box */}
              <Card
                elevation={4}
                size="$4"
                bordered
                shadowColor="$shadow3"
                shadowRadius={8}
              >
                <Card.Header>
                  <XStack borderRadius="$8" gap="$4" alignItems="center">
                    <Info color="$color9" size="$4" />
                    <Text fontFamily="$body" color="$color11" fontSize="$1">
                      Select a workspace to make it active - new notes and
                      searches will use your selected workspace.
                    </Text>
                  </XStack>
                </Card.Header>
              </Card>
            </YStack>
          </ScrollView>
          {user?.last_selected_workspace_id === id ? (
            <Button
              theme="accent"
              alignSelf="flex-end"
              marginTop="$4"
              width="100%"
              marginBottom="$6"
              disabled
            >
              <Text color="$color1">Selected Workspace</Text>
            </Button>
          ) : (
            <Button
              theme="accent"
              alignSelf="flex-end"
              marginTop="$4"
              width="100%"
              marginBottom="$6"
              onPress={() => activateWorkspace(id as string)}
            >
              <Text color="$color1">Select Workspace</Text>
            </Button>
          )}
        </YStack>
      )}
    </AnimatedScreen>
  );
}
