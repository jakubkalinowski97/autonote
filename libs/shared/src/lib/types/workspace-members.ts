import { Database } from './supabase.generated';

export type WorkspaceMembers = Database['public']['Tables']['workspace_members']['Row'];
export type WorkspaceMembersInsert = Database['public']['Tables']['workspace_members']['Insert'];
export type WorkspaceMembersUpdate = Database['public']['Tables']['workspace_members']['Update'];