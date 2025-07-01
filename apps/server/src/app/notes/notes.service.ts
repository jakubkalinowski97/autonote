import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import {
  Note,
  NoteInsert,
  NoteUpdate,
  NoteVersion,
  NoteVersionInsert,
  NoteEmbeddings,
  Tag,
} from '@auto-note-workspace/shared';

@Injectable()
export class NotesService {
  constructor(private readonly supabaseService: SupabaseService) {}

  // --- Notes CRUD ---
  async create(note: NoteInsert): Promise<Note> {
    const { data, error } = await this.supabaseService.getClient()
      .from('notes')
      .insert(note)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async findAll(workspaceId: string): Promise<Note[]> {
    const { data, error } = await this.supabaseService.getClient()
      .from('notes')
      .select('*')
      .eq('workspace_id', workspaceId);
    if (error) throw error;
    return data;
  }

  async findOne(id: string): Promise<Note> {
    const { data, error } = await this.supabaseService.getClient()
      .from('notes')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  }

  async update(id: string, note: NoteUpdate): Promise<Note> {
    const { data, error } = await this.supabaseService.getClient()
      .from('notes')
      .update(note)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async delete(id: string): Promise<Note> {
    const { data, error } = await this.supabaseService.getClient()
      .from('notes')
      .delete()
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  // --- Note Versioning ---
  async createVersion(noteId: string, data: NoteVersionInsert): Promise<NoteVersion> {
    const { data: version, error } = await this.supabaseService.getClient()
      .from('note_versions')
      .insert({ ...data, note_id: noteId })
      .select()
      .single();
    if (error) throw error;
    // Update current_version_id in notes
    await this.supabaseService.getClient()
      .from('notes')
      .update({ current_version_id: version.id })
      .eq('id', noteId);
    return version;
  }

  async getVersions(noteId: string): Promise<NoteVersion[]> {
    const { data, error } = await this.supabaseService.getClient()
      .from('note_versions')
      .select('*')
      .eq('note_id', noteId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }

  async revertToVersion(noteId: string, versionId: string): Promise<Note> {
    // Set current_version_id in notes
    const { data: note, error } = await this.supabaseService.getClient()
      .from('notes')
      .update({ current_version_id: versionId })
      .eq('id', noteId)
      .select()
      .single();
    if (error) throw error;
    return note;
  }

  // --- Embeddings ---
  async addEmbedding(noteVersionId: string, embedding: number[]): Promise<NoteEmbeddings> {
    const { data, error } = await this.supabaseService.getClient()
      .from('note_embeddings')
      .insert({ note_version_id: noteVersionId, embedding })
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async searchByEmbedding(workspaceId: string, embedding: number[], topK: number): Promise<Note[]> {
    // Use pgvector cosine similarity operator <=>
    const { data, error } = await this.supabaseService.getClient()
      .rpc('semantic_search_notes', { workspace_id: workspaceId, query_embedding: embedding, top_k: topK });
    if (error) throw error;
    return data;
  }

  // --- Tagging ---
  async addTags(noteId: string, tags: string[]): Promise<void> {
    const tagRows = tags.map((tag) => ({ note_id: noteId, tag_id: tag }));
    const { error } = await this.supabaseService.getClient()
      .from('note_tags')
      .insert(tagRows);
    if (error) throw error;
  }

  async removeTag(noteId: string, tag: string): Promise<void> {
    const { error } = await this.supabaseService.getClient()
      .from('note_tags')
      .delete()
      .eq('note_id', noteId)
      .eq('tag_id', tag);
    if (error) throw error;
  }

  async getTags(noteId: string): Promise<Tag[]> {
    const { data, error } = await this.supabaseService.getClient()
      .from('note_tags')
      .select('tags(id, name, created_at)')
      .eq('note_id', noteId);
    if (error) throw error;
    // data is array of { tags: Tag[] | null }
    return (data ?? [])
      .flatMap((row) => Array.isArray(row.tags) ? row.tags : row.tags ? [row.tags] : [])
      .filter((tag): tag is Tag => !!tag);
  }

  // --- Semantic Search ---
  async semanticSearch(workspaceId: string, queryEmbedding: number[], topK: number): Promise<Note[]> {
    // Use pgvector cosine similarity operator <=>
    const { data, error } = await this.supabaseService.getClient()
      .rpc('semantic_search_notes', { workspace_id: workspaceId, query_embedding: queryEmbedding, top_k: topK });
    if (error) throw error;
    return data;
  }

  // --- Note History ---
  async getNoteHistory(noteId: string): Promise<NoteVersion[]> {
    return this.getVersions(noteId);
  }
}
