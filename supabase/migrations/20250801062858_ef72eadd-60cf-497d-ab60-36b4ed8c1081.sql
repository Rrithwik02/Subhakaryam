-- Clean up duplicate RLS policies on chat_messages table
DROP POLICY IF EXISTS "Users can insert messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Users can send messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Users can view messages they sent or received" ON public.chat_messages;
DROP POLICY IF EXISTS "Users can view their messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Users can view their own messages" ON public.chat_messages;

-- Create a single, clear RLS policy for chat messages
CREATE POLICY "Users can manage their own chat messages" 
ON public.chat_messages 
FOR ALL 
USING (
  auth.uid() = sender_id OR auth.uid() = receiver_id
)
WITH CHECK (
  auth.uid() = sender_id
);

-- Enable realtime for chat_messages table
ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;