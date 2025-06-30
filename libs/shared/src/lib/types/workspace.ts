import { Database } from '../supabase';

export type Workspace = Database['public']['Tables']['workspaces']['Row'];
export type WorkspaceInsert = Omit<Database['public']['Tables']['workspaces']['Insert'], 'created_at' | 'updated_at' | 'owner_id'>;
export type WorkspaceUpdate = Omit<Database['public']['Tables']['workspaces']['Update'], 'created_at' | 'updated_at' | 'owner_id'>;