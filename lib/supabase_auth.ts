import { supabase } from "./supabase";

export async function signUp({ email, password }: { email: string; password: string }) {
	const { data, error } = await supabase.auth.signUp({ email, password });

	if (error)
		console.error("Sign Up Page - Error signing up new user:", error.message);
	else
		console.log("Sign Up Page - User signed up successfully: ", data);

	return data;
}

export async function signIn({ email, password }: { email: string; password: string }) {
	const { data, error } = await supabase.auth.signInWithPassword({ email, password });

	if (error) throw error;

	return data;
}

export async function signOut() {
	await supabase.auth.signOut();
}
