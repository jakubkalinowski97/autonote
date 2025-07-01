import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { NoteEmbeddings } from '@auto-note-workspace/shared';

@Injectable()
export class EmbeddingsService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async addEmbedding(noteVersionId: string, embedding: number[]): Promise<NoteEmbeddings> {
    const { data, error } = await this.supabaseService.getClient()
      .from('note_embeddings')
      .insert({
        note_version_id: noteVersionId,
        embedding: JSON.stringify(embedding), // Convert array to string for storage
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async findByNoteVersion(noteVersionId: string): Promise<NoteEmbeddings | null> {
    const { data, error } = await this.supabaseService.getClient()
      .from('note_embeddings')
      .select('*')
      .eq('note_version_id', noteVersionId)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "not found"
    return data;
  }

  async deleteByNoteVersion(noteVersionId: string): Promise<void> {
    const { error } = await this.supabaseService.getClient()
      .from('note_embeddings')
      .delete()
      .eq('note_version_id', noteVersionId);

    if (error) throw error;
  }
} 