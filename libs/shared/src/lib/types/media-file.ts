import { Database } from './supabase.generated';

export type MediaFile = Database['public']['Tables']['media_files']['Row'];
export type MediaFileInsert = Database['public']['Tables']['media_files']['Insert'];
export type MediaFileUpdate = Database['public']['Tables']['media_files']['Update'];