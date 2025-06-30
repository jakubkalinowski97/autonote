CREATE TABLE public.conversation_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_type varchar(10) NOT NULL CHECK (sender_type IN ('user', 'ai')),
  content text NOT NULL,
  message_type varchar(20) DEFAULT 'text' CHECK (message_type IN ('text', 'search_results')),
  related_note_ids uuid[],
  ai_metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
); 