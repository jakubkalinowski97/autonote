import { Database } from './supabase.generated';

export type ConversationMessages = Database['public']['Tables']['conversation_messages']['Row'];
export type ConversationMessagesInsert = Database['public']['Tables']['conversation_messages']['Insert'];
export type ConversationMessagesUpdate = Database['public']['Tables']['conversation_messages']['Update'];