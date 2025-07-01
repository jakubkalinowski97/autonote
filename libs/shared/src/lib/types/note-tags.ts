import { Database } from './supabase.generated';

export type NoteTags = Database['public']['Tables']['note_tags']['Row'];
export type NoteTagsInsert = Database['public']['Tables']['note_tags']['Insert'];
export type NoteTagsUpdate = Database['public']['Tables']['note_tags']['Update'];