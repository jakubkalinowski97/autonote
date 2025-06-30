ALTER TABLE public.note_embeddings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Workspace members can access note_embeddings"
  ON public.note_embeddings
  FOR ALL
  USING (
    note_version_id IN (
      SELECT id FROM public.note_versions
      WHERE note_id IN (
        SELECT id FROM public.notes
        WHERE workspace_id IN (
          SELECT workspace_id FROM public.workspace_members
          WHERE user_id = auth.uid()
        )
      )
    )
  ); 