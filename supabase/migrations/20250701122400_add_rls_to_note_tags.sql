ALTER TABLE public.note_tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Workspace members can access note_tags"
  ON public.note_tags
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