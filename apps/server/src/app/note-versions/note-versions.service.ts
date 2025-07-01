import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { NoteVersion, NoteVersionInsert } from '@auto-note-workspace/shared';

@Injectable()
export class NoteVersionsService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async createVersion(noteId: string, versionData: Omit<NoteVersionInsert, 'note_id'>): Promise<NoteVersion> {
    const { data, error } = await this.supabaseService.getClient()
      .from('note_versions')
      .insert({ ...versionData, note_id: noteId })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getVersionsByNoteId(noteId: string): Promise<NoteVersion[]> {
    const { data, error } = await this.supabaseService.getClient()
      .from('note_versions')
      .select('*')
      .eq('note_id', noteId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  async findOne(id: string): Promise<NoteVersion> {
    const { data, error } = await this.supabaseService.getClient()
      .from('note_versions')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }
} 