import { Module } from '@nestjs/common';
import { NoteVersionsService } from './note-versions.service';
import { NoteVersionsController } from './note-versions.controller';

@Module({
  providers: [NoteVersionsService],
  controllers: [NoteVersionsController],
})
export class NoteVersionsModule {} 