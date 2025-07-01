import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { MediaFile } from '@auto-note-workspace/shared';

@Injectable()
export class MediaService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async uploadFile(file: any, userId: string): Promise<MediaFile> {
    // TODO: Upload to Supabase Storage and create media_files record
    const { data, error } = await this.supabaseService.getClient()
      .from('media_files')
      .insert({
        file_url: 'placeholder-url',
        file_type: file.mimetype,
        file_size: file.size,
        original_filename: file.originalname,
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async linkToNoteVersion(mediaId: string, noteVersionId: string): Promise<void> {
    const { error } = await this.supabaseService.getClient()
      .from('media_files')
      .update({ note_version_id: noteVersionId })
      .eq('id', mediaId);
    
    if (error) throw error;
  }

  async getSignedUrl(fileUrl: string): Promise<string> {
    // TODO: Generate signed URL for file access
    return fileUrl;
  }
} 