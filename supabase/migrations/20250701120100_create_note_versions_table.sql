CREATE TABLE public.note_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  note_id uuid REFERENCES public.notes(id) ON DELETE CASCADE,
  content text NOT NULL,
  transformation_style varchar(50),
  ai_metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES public.users(id),
  source_type varchar(20) CHECK (source_type IN ('audio', 'image', 'text')),
  source_url varchar(512),
  processing_status varchar(20) DEFAULT 'completed' CHECK (processing_status IN ('processing', 'completed', 'failed'))
); 