import { Module } from '@nestjs/common';
import { ConversationMessagesService } from './conversation-messages.service';
import { ConversationMessagesController } from './conversation-messages.controller';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  imports: [SupabaseModule],
  providers: [ConversationMessagesService],
  controllers: [ConversationMessagesController],
  exports: [ConversationMessagesService],
})
export class ConversationMessagesModule {} 