import { Controller } from '@nestjs/common';
import { NoteVersionsService } from './note-versions.service';

@Controller('note-versions')
export class NoteVersionsController {
  constructor(private readonly noteVersionsService: NoteVersionsService) {}
} 