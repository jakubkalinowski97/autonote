import { Database } from './supabase.generated';

export type NoteEmbeddings = Database['public']['Tables']['note_embeddings']['Row'];
export type NoteEmbeddingsInsert = Database['public']['Tables']['note_embeddings']['Insert'];
export type NoteEmbeddingsUpdate = Database['public']['Tables']['note_embeddings']['Update'];