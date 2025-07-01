import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { Tag, TagInsert } from '@auto-note-workspace/shared';

@Injectable()
export class TagsService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async processTags(noteId: string, tagNames: string[], userId: string): Promise<void> {
    if (!tagNames || tagNames.length === 0) return;

    // 1. Ensure all tags exist
    const tags = await this.ensureTagsExist(tagNames);

    // 2. Create note-tag associations
    const tagAssociations = tags.map(tag => ({
      note_id: noteId,
      tag_id: tag.id,
      assigned_by: userId,
    }));

    const { error } = await this.supabaseService.getClient()
      .from('note_tags')
      .insert(tagAssociations);

    if (error) throw error;
  }

  private async ensureTagsExist(tagNames: string[]): Promise<Tag[]> {
    const tags: Tag[] = [];

    for (const name of tagNames) {
      // Check if tag exists
      const { data: existingTag } = await this.supabaseService.getClient()
        .from('tags')
        .select('*')
        .eq('name', name)
        .single();

      if (existingTag) {
        tags.push(existingTag);
      } else {
        // Create new tag
        const { data: newTag, error } = await this.supabaseService.getClient()
          .from('tags')
          .insert({ name })
          .select()
          .single();

        if (error) throw error;
        tags.push(newTag);
      }
    }

    return tags;
  }

  async findAll(): Promise<Tag[]> {
    const { data, error } = await this.supabaseService.getClient()
      .from('tags')
      .select('*')
      .order('name');

    if (error) throw error;
    return data;
  }

  async create(tagInsert: TagInsert): Promise<Tag> {
    const { data, error } = await this.supabaseService.getClient()
      .from('tags')
      .insert(tagInsert)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
} 