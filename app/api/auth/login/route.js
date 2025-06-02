// app/api/auth/login/route.js
import { createSupabaseServerClient } from '@/lib/supabase/server'; // Path to your server client

export async function POST(req) {
  const supabase = await createSupabaseServerClient(); // Added await
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return Response.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Supabase Login Error:', error.message);
      return Response.json({ error: error.message || 'Invalid login credentials.' }, { status: error.status || 401 });
    }

    // The server client with cookie helpers automatically handles setting the session cookie.
    return Response.json({ message: 'Login successful', session: data.session, user: data.user }, { status: 200 });

  } catch (err) {
    console.error('API Login Route General Error:', err);
    // Ensure err.message is accessed safely
    const errorMessage = err instanceof Error ? err.message : 'Internal server error during login.';
    return Response.json({ error: errorMessage }, { status: 500 });
  }
}