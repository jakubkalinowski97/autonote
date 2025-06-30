ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "User can access own conversations"
  ON public.conversations
  FOR ALL
  USING (user_id = auth.uid()); 