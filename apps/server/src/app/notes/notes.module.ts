import { Module } from '@nestjs/common';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { SupabaseModule } from '../supabase/supabase.module';
import { AIModule } from '../ai/ai.module';
import { MediaModule } from '../media/media.module';
import { TagsModule } from '../tags/tags.module';
import { NoteVersionsModule } from '../note-versions/note-versions.module';
import { UsageModule } from '../usage/usage.module';
import { EmbeddingsModule } from '../embeddings/embeddings.module';

@Module({
  imports: [
    SupabaseModule,
    AIModule,
    MediaModule,
    TagsModule,
    NoteVersionsModule,
    UsageModule,
    EmbeddingsModule,
  ],
  providers: [NotesService],
  controllers: [NotesController],
  exports: [NotesService],
})
export class NotesModule {}
