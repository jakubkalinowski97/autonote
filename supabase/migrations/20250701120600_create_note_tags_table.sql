CREATE TABLE public.note_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  note_id uuid REFERENCES public.notes(id) ON DELETE CASCADE,
  tag_id uuid REFERENCES public.tags(id) ON DELETE CASCADE,
  assigned_by varchar(10) CHECK (assigned_by IN ('user', 'ai')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(note_id, tag_id)
); 