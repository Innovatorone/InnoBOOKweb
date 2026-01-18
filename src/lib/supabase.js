import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL va Anon Key .env.local faylida bo\'lishi kerak!');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
