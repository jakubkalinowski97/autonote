CREATE EXTENSION IF NOT EXISTS "vector";

CREATE TABLE public.note_embeddings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  note_version_id uuid REFERENCES public.note_versions(id) ON DELETE CASCADE,
  embedding vector(1536),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX note_embeddings_embedding_idx
  ON public.note_embeddings USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100); 