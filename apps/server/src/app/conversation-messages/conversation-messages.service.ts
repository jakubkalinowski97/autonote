import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { 
  ConversationMessages, 
  ConversationMessagesInsert,
  ConversationMessagesUpdate 
} from '@auto-note-workspace/shared';

@Injectable()
export class ConversationMessagesService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async create(messageInsert: ConversationMessagesInsert): Promise<ConversationMessages> {
    const { data, error } = await this.supabaseService.getClient()
      .from('conversation_messages')
      .insert(messageInsert)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getRecentHistory(conversationId: string, limit = 10): Promise<ConversationMessages[]> {
    const { data, error } = await this.supabaseService.getClient()
      .from('conversation_messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data.reverse(); // Return in chronological order
  }

  async findByConversation(conversationId: string): Promise<ConversationMessages[]> {
    const { data, error } = await this.supabaseService.getClient()
      .from('conversation_messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    return data;
  }

  async findOne(id: string): Promise<ConversationMessages> {
    const { data, error } = await this.supabaseService.getClient()
      .from('conversation_messages')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  async update(id: string, messageUpdate: ConversationMessagesUpdate): Promise<ConversationMessages> {
    const { data, error } = await this.supabaseService.getClient()
      .from('conversation_messages')
      .update(messageUpdate)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabaseService.getClient()
      .from('conversation_messages')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
} 