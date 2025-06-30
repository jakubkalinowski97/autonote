ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Workspace members can access notes"
  ON public.notes
  FOR ALL
  USING (
    workspace_id IN (
      SELECT workspace_id FROM public.workspace_members
      WHERE user_id = auth.uid()
    )
  ); 