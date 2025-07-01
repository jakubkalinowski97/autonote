import { Module } from '@nestjs/common';
import { ConversationMessagesService } from './conversation-messages.service';
import { ConversationMessagesController } from './conversation-messages.controller';

@Module({
  providers: [ConversationMessagesService],
  controllers: [ConversationMessagesController],
})
export class ConversationMessagesModule {} 