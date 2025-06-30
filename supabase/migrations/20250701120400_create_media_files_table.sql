CREATE TABLE public.media_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  note_version_id uuid REFERENCES public.note_versions(id) ON DELETE CASCADE,
  file_url varchar(512) NOT NULL,
  file_type varchar(50) NOT NULL,
  file_size integer,
  original_filename varchar(255),
  created_at timestamptz NOT NULL DEFAULT now()
); 