import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://eldgizccualhhhaczooa.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVsZGdpemNjdWFsaGhoYWN6b29hIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNDQwMjU3MiwiZXhwIjoyMDQ5OTc4NTcyfQ.4vbcWHUGG5yJ1VKqvj6t2DOFamHTBB2E_WkwXOS5drk";

export const supabaseAdmin = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);