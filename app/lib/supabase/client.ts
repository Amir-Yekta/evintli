import { createBrowserClient } from '@supabase/ssr';
export function createSupabaseBrowserClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase URL or Anon Key is missing from .env.local. Make sure they are prefixed with NEXT_PUBLIC_");
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}