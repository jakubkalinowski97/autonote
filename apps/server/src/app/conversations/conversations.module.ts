import { Module } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { ConversationsController } from './conversations.controller';
import { SupabaseModule } from '../supabase/supabase.module';
import { AIModule } from '../ai/ai.module';
import { NotesModule } from '../notes/notes.module';
import { UsageModule } from '../usage/usage.module';
import { ConversationMessagesModule } from '../conversation-messages/conversation-messages.module';

@Module({
  imports: [
    SupabaseModule,
    AIModule,
    NotesModule,
    UsageModule,
    ConversationMessagesModule,
  ],
  providers: [ConversationsService],
  controllers: [ConversationsController],
  exports: [ConversationsService],
})
export class ConversationsModule {} 