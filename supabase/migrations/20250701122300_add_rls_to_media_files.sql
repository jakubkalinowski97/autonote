ALTER TABLE public.media_files ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Workspace members can access media_files"
  ON public.media_files
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