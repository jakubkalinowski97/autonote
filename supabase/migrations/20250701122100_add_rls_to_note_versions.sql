ALTER TABLE public.note_versions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Workspace members can access note_versions"
  ON public.note_versions
  FOR ALL
  USING (
    note_id IN (
      SELECT id FROM public.notes
      WHERE workspace_id IN (
        SELECT workspace_id FROM public.workspace_members
        WHERE user_id = auth.uid()
      )
    )
  ); 