import { Workspace, WorkspaceInsert } from "@auto-note-workspace/shared";
import api from "./api";

export const getWorkspaces = async (): Promise<Workspace[]> => {
  const response = await api.get('/workspaces');
  return response.data;
};

export const getWorkspace = async (workspaceId: string): Promise<Workspace> => {
  const response = await api.get(`/workspaces/${workspaceId}`);
  return response.data;
};

export const selectWorkspace = async (workspaceId: string): Promise<void> => {
  await api.post(`/workspaces/${workspaceId}/activate`);
};

export const updateWorkspace = async (workspace: Workspace): Promise<void> => {
  await api.put(`/workspaces/${workspace.id}`, workspace);
};

export const createWorkspace = async (workspace: WorkspaceInsert): Promise<void> => {
  await api.post('/workspaces', workspace);
};

export const deleteWorkspace = async (workspaceId: string): Promise<void> => {
  await api.delete(`/workspaces/${workspaceId}`);
};