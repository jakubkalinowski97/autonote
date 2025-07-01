import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { AIService } from '../ai/ai.service';
import { NotesService } from '../notes/notes.service';
import { UsageService } from '../usage/usage.service';
import { ConversationMessagesService } from '../conversation-messages/conversation-messages.service';
import { AskQuestionDto } from './dto/ask-question.dto';
import { UserPayload } from '../auth/decorators/user.decorator';
import { WorkspacePayload } from '../workspace/decorators/workspace.decorator';
import {
  Conversation,
  ConversationInsert,
  ConversationMessages,
  Note,
} from '@auto-note-workspace/shared';

@Injectable()
export class ConversationsService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly conversationMessagesService: ConversationMessagesService,
    private readonly aiService: AIService,
    private readonly notesService: NotesService,
    private readonly usageService: UsageService,
  ) {}

  async processQuery(
    conversationId: string,
    askQuestionDto: AskQuestionDto,
    user: UserPayload,
    workspace: WorkspacePayload,
  ): Promise<ConversationMessages> {
    // 1. Check usage limits
    await this.usageService.checkQueryLimit(user.id);

    // 2. Store user message
    const userMessage = await this.conversationMessagesService.create({
      conversation_id: conversationId,
      content: askQuestionDto.query,
      sender_type: 'user',
    });

    // 3. Retrieve conversation history
    const history = await this.conversationMessagesService.getRecentHistory(
      conversationId,
      10
    );

    // 4. Use AI to determine search strategy
    const searchStrategy = await this.aiService.determineSearchStrategy(
      askQuestionDto.query,
      history
    );

    // 5. Generate query embedding with context
    const contextualQuery = this.buildContextualQuery(
      askQuestionDto.query,
      history
    );
    const queryEmbedding = await this.aiService.generateEmbedding(contextualQuery);

    let response: string;
    let relatedNotes: Note[] = [];

    if (searchStrategy === 'semantic_search') {
      // 6a. Semantic search only
      relatedNotes = await this.notesService.semanticSearch(
        workspace.id,
        queryEmbedding,
        5
      );
      response = this.formatSearchResults(relatedNotes);
    } else {
      // 6b. Q&A with LLM
      relatedNotes = await this.notesService.semanticSearch(
        workspace.id,
        queryEmbedding,
        3
      );
      
      const context = await this.assembleContext(relatedNotes, history);
      response = await this.aiService.generateAnswer(
        askQuestionDto.query,
        context
      );
    }

    // 7. Store AI response
    const aiMessage = await this.conversationMessagesService.create({
      conversation_id: conversationId,
      content: response,
      sender_type: 'ai',
      related_note_ids: relatedNotes.map(note => note.id),
    });

    // 8. Track usage
    await this.usageService.incrementQuery(user.id);

    return aiMessage;
  }

  private buildContextualQuery(query: string, history: ConversationMessages[]): string {
    const recentMessages = history
      .slice(-3) // Last 3 messages for context
      .map(msg => `${msg.sender_type}: ${msg.content}`)
      .join('\n');
    
    return recentMessages ? `${recentMessages}\nuser: ${query}` : query;
  }

  private formatSearchResults(notes: Note[]): string {
    if (notes.length === 0) {
      return "I couldn't find any relevant notes for your search.";
    }
    
    return `I found ${notes.length} relevant notes:\n\n` + 
      notes.map((note, index) => 
        `${index + 1}. ${note.title || 'Untitled Note'}`
      ).join('\n');
  }

  private async assembleContext(notes: Note[], history: ConversationMessages[]): Promise<string> {
    const noteContents = notes.map(note => 
      `Note: ${note.title || 'Untitled'}\nContent: [Note content would be loaded here]`
    ).join('\n\n');
    
    const conversationContext = history
      .slice(-5) // Last 5 messages
      .map(msg => `${msg.sender_type}: ${msg.content}`)
      .join('\n');
    
    return `Conversation Context:\n${conversationContext}\n\nRelevant Notes:\n${noteContents}`;
  }

  // Basic CRUD operations
  async create(conversationInsert: ConversationInsert): Promise<Conversation> {
    const { data, error } = await this.supabaseService.getClient()
      .from('conversations')
      .insert(conversationInsert)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async findByWorkspace(workspaceId: string): Promise<Conversation[]> {
    const { data, error } = await this.supabaseService.getClient()
      .from('conversations')
      .select('*')
      .eq('workspace_id', workspaceId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  async findOne(id: string): Promise<Conversation> {
    const { data, error } = await this.supabaseService.getClient()
      .from('conversations')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }
} 