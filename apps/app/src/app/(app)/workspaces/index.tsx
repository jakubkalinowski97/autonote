import { YStack, ScrollView, XStack, Spinner, Button } from 'tamagui';
import { WorkspaceCard } from '../../../components/cards/WorkspaceCard';
import { AnimatedScreen } from '../../../components/ui/AnimatedScreen';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Workspace, WorkspaceInsert } from '@auto-note-workspace/shared';
import { createWorkspace, getWorkspaces, selectWorkspace } from '../../../api/workspace';
import { useAuth } from '../../../contexts/AuthContext';
import { useSheet } from '../../../contexts/SheetContext';
import { useRouter } from 'expo-router';
import { Plus } from '@tamagui/lucide-icons';
import WorkspaceCreate from './_create';

export default function Workspaces() {
  const router = useRouter();
  const { user, refetchUser, loading: authLoading } = useAuth();
  const { openSheet, closeSheet, setData } = useSheet();
  const { data: workspaces, isLoading, refetch: refetchWorkspaces } = useQuery<Workspace[]>({
    queryKey: ['workspaces'],
    queryFn: () => getWorkspaces(),
  });

  const selectWorkspaceMutation = useMutation({
    mutationFn: (workspaceId: string) => selectWorkspace(workspaceId),
    onSuccess: () => {
      refetchUser();
    },
  });

  const createWorkspaceMutation = useMutation({
    mutationFn: (workspace: WorkspaceInsert) => createWorkspace(workspace),
    onSuccess: () => {
      refetchWorkspaces();
      closeSheet();
      setData({ isPending: false });
    },
    onMutate: () => {
      setData({ isPending: true });
    },
  });

  return (
    <AnimatedScreen>
      {(isLoading || authLoading) ? (
        <YStack flex={1} justifyContent="center" alignItems="center">
          <Spinner size="large" color="$color10" />
        </YStack>
      ) : (
        <YStack
          flex={1}
          paddingHorizontal="$5"
          paddingTop="$4"
          backgroundColor="$background"
        >
          <ScrollView flex={1}>
            <XStack gap="$4" width="100%">
              <div
                style={{
                  width: '100%',
                  gap: '20px',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                }}
              >
                {workspaces?.map((workspace, idx) => (
                  <WorkspaceCard
                    key={idx}
                    title={workspace.name}
                    count={0}
                    isActive={user?.last_selected_workspace_id === workspace.id}
                    isActionLoading={selectWorkspaceMutation.variables === workspace.id && selectWorkspaceMutation.isPending}
                    action={() => {
                      selectWorkspaceMutation.mutate(workspace.id);
                    }}
                    onPress={() => {
                      router.push(`/workspaces/${workspace.id}`);
                    }}
                  />
                ))}
                <Button
                  height="200px"
                  width="100%"
                  borderWidth={1}
                  borderColor="$color6"
                  backgroundColor="$color2"
                  elevation={4}
                  shadowColor="$shadow3"
                  shadowRadius={8}
                  onPress={() => {
                    openSheet(<WorkspaceCreate createWorkspace={createWorkspaceMutation.mutate} />);
                  }}
                >
                  <Plus size={40} color="$color10" />
                </Button>
              </div>
            </XStack>
          </ScrollView>
        </YStack>
      )}
    </AnimatedScreen>
  );
}
