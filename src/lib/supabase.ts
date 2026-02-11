import { createClient } from '@supabase/supabase-js';

// 1. Load env variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 2. Safety check to prevent crashing if variables are missing
if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables! Check your .env file.');
}

// 3. Export the client
export const supabase = createClient(supabaseUrl, supabaseKey);