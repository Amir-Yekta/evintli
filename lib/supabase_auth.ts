import { supabase } from './supabase';

export async function signUp({ email, password }: { email: string, password: string }) {
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) throw error;
  
  return data;
}

export async function signIn({ email, password }: { email: string, password: string }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) throw error;

  return data;
}

export async function signOut() {
  await supabase.auth.signOut();
}
