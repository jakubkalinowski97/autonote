import { Module } from '@nestjs/common';
import { NoteVersionsService } from './note-versions.service';
import { NoteVersionsController } from './note-versions.controller';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  imports: [SupabaseModule],
  providers: [NoteVersionsService],
  controllers: [NoteVersionsController],
  exports: [NoteVersionsService],
})
export class NoteVersionsModule {} 