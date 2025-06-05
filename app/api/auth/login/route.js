import { login } from '@/lib/supabase_auth';

/**
 * @param {Request} req
 */
export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return Response.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const { session, error } = await login({ email, password })

    if (error) {
      if (error.message.includes('Invalid login credentials'))
        return Response.json({ error: 'Invalid credentials' }, { status: 401 });

      console.error('Login Route - Supabase signIn error:' + error.message);
      return Response.json({ error: 'Internal server error.' }, { status: 500 });
    }

    const token = session?.access_token;

    return Response.json({ message: 'Login successful', token }, { status: 200 });
  } catch (err) {
    console.error('Login Route - General error:' + err);
    return Response.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
