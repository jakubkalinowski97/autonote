import { Database } from './supabase.generated';

export type NoteVersion = Database['public']['Tables']['note_versions']['Row'];
export type NoteVersionInsert = Database['public']['Tables']['note_versions']['Insert'];
export type NoteVersionUpdate = Database['public']['Tables']['note_versions']['Update'];