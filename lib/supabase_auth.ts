import { supabase } from "./supabase";

export async function signUp({ email, password }: { email: string; password: string }) {
	const { data, error } = await supabase.auth.signUp({ email, password });

	if (error)
		console.error('Sign Up - Error signing up new user:' + error.message);
	else
		console.log('Sign Page - User signed up successfully:', data);

	return { ...data, error };
}

export async function login({ email, password }: { email: string; password: string }) {
	const { data, error } = await supabase.auth.signInWithPassword({ email, password });

	if (error)
    console.error('Login - Error signing in user:' + error.message);
  else
    console.log('Login - User signed in successfully:', data);

	return { ...data, error };
}

export async function signOut() {
	await supabase.auth.signOut();
}
