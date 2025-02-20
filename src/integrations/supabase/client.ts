
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://eldgizccualhhhaczooa.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVsZGdpemNjdWFsaGhoYWN6b29hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ0MDI1NzIsImV4cCI6MjA0OTk3ODU3Mn0.SYimGwLFRPWs9i3TlbovjIprMllVcnk01PjVyXF306o";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    storage: localStorage,
    storageKey: 'sb-auth-token'
  }
});
