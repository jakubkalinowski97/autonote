ALTER TABLE public.conversation_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "User can access messages in their conversations"
  ON public.conversation_messages
  FOR ALL
  USING (
    conversation_id IN (
      SELECT id FROM public.conversations
      WHERE user_id = auth.uid()
    )
  ); 