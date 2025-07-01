export class CreateNoteDto {
  title?: string;
  content?: string;
  inputType: 'text' | 'audio' | 'image';
  transformationStyle?: string;
  manualTags?: string[];
} 