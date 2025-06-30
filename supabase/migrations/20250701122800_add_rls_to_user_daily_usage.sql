ALTER TABLE public.user_daily_usage ENABLE ROW LEVEL SECURITY;
CREATE POLICY "User can access own daily usage"
  ON public.user_daily_usage
  FOR ALL
  USING (user_id = auth.uid()); 