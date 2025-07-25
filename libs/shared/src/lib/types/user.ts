import { Database } from './supabase.generated';

export type User = Database['public']['Tables']['users']['Row'] & {
  last_selected_workspace: Database['public']['Tables']['workspaces']['Row'];
};
export type UserInsert = Database['public']['Tables']['users']['Insert'];
export type UserUpdate = Database['public']['Tables']['users']['Update']; 