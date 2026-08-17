import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Do not restore sessions from localStorage across page loads.
    // This forces admins to sign in again every time they open the
    // admin area (the login page always shows), preventing anyone
    // from landing on the dashboard without entering credentials.
    persistSession: false,
  },
});
