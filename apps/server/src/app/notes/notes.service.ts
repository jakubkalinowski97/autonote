import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { AIService } from '../ai/ai.service';
import { MediaService } from '../media/media.service';
import { TagsService } from '../tags/tags.service';
import { NoteVersionsService } from '../note-versions/note-versions.service';
import { UsageService } from '../usage/usage.service';
import { EmbeddingsService } from '../embeddings/embeddings.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UserPayload } from '../auth/decorators/user.decorator';
import { WorkspacePayload } from '../workspace/decorators/workspace.decorator';
import {
  Note,
  NoteInsert,
  NoteUpdate,
  NoteVersion,
  NoteVersionInsert,
  NoteEmbeddings,
  Tag,
  MediaFile,
} from '@auto-note-workspace/shared';

@Injectable()
export class NotesService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly aiService: AIService,
    private readonly mediaService: MediaService,
    private readonly tagsService: TagsService,
    private readonly noteVersionsService: NoteVersionsService,
    private readonly usageService: UsageService,
    private readonly embeddingsService: EmbeddingsService,
  ) {}

  // Main orchestration method for note creation
  async createNote(
    createNoteDto: CreateNoteDto,
    media: any,
    user: UserPayload,
    workspace: WorkspacePayload,
  ): Promise<Note> {
    // 1. Check usage limits
    await this.usageService.checkCreateNoteLimit(user.id);

    // 2. Process input based on type
    let textContent = createNoteDto.content || '';
    let mediaFile: MediaFile | null = null;

    if (createNoteDto.inputType === 'audio' && media) {
      // Upload media and transcribe
      mediaFile = await this.mediaService.uploadFile(media, user.id);
      textContent = await this.aiService.transcribeAudio(mediaFile.file_url);
    } else if (createNoteDto.inputType === 'image' && media) {
      // Upload media and analyze
      mediaFile = await this.mediaService.uploadFile(media, user.id);
      textContent = await this.aiService.analyzeImage(mediaFile.file_url);
    }

    // 3. AI Processing Pipeline
    const summary = await this.aiService.summarizeText(textContent);
    const aiTags = await this.aiService.generateTags(summary);
    const allTags = [...(createNoteDto.manualTags || []), ...aiTags];
    
    // 4. Create embedding input
    const embeddingInput = this.buildEmbeddingInput(
      createNoteDto.title,
      summary,
      allTags
    );
    const embedding = await this.aiService.generateEmbedding(embeddingInput);

    // 5. Create note and version
    const note = await this.createNoteRecord({
      title: createNoteDto.title,
      workspace_id: workspace.id,
      author_id: user.id,
    });

    const noteVersion = await this.noteVersionsService.createVersion(note.id, {
      content: summary,
      source_type: createNoteDto.inputType,
      source_url: mediaFile?.file_url || null,
      transformation_style: createNoteDto.transformationStyle,
      created_by: user.id,
    });

    // 6. Update note with current version
    await this.updateNoteCurrentVersion(note.id, noteVersion.id);

    // 7. Store embedding
    await this.embeddingsService.addEmbedding(noteVersion.id, embedding);

    // 8. Link media file to version
    if (mediaFile) {
      await this.mediaService.linkToNoteVersion(mediaFile.id, noteVersion.id);
    }

    // 9. Process tags
    await this.tagsService.processTags(note.id, allTags, user.id);

    // 10. Track usage
    await this.usageService.incrementNoteCreation(user.id);

    return note;
  }

  private buildEmbeddingInput(title?: string, summary?: string, tags?: string[]): string {
    const parts = [];
    if (title) parts.push(title);
    if (tags?.length) parts.push(tags.join(', '));
    if (summary) parts.push(summary);
    return parts.join('\n');
  }

  private async createNoteRecord(noteInsert: NoteInsert): Promise<Note> {
    const { data, error } = await this.supabaseService.getClient()
      .from('notes')
      .insert(noteInsert)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  private async updateNoteCurrentVersion(noteId: string, versionId: string): Promise<void> {
    const { error } = await this.supabaseService.getClient()
      .from('notes')
      .update({ current_version_id: versionId })
      .eq('id', noteId);
    if (error) throw error;
  }

  // --- Existing CRUD methods ---
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
