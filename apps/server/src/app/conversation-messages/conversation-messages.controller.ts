import { Controller } from '@nestjs/common';
import { ConversationMessagesService } from './conversation-messages.service';

@Controller('conversation-messages')
export class ConversationMessagesController {
  constructor(private readonly conversationMessagesService: ConversationMessagesService) {}
} 