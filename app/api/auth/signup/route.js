import { signUp } from '../../../../lib/supabase_auth';
import { createProfile } from '../../../../lib/supabase_crud';

/**
 * @param {Request} req
 */
export async function POST(req) {
  try {
    /** @type
     * {{ name: string, email: string, password: string }}
     */
    const { name, email, password } = await req.json();

    if (!email || !password)
      return Response.json({ error: 'Email and password are required.' }, { status: 400 });

    const { user, error } = await signUp({ email, password })

    if (error) {
      if (error.message.includes('User already registered'))
        return Response.json({ error: 'User already exists.' }, { status: 400 });

      console.error('Sign Up Route - Supabase signUp error:' + error.message);
      return Response.json({ error: 'Internal server error.' }, { status: 500 });
    }

    if (user) {
      try {
        await createProfile(user.id, name)
      } catch (profileError) {
        if (profileError instanceof Error)
          console.error('Signup Route - Error creating user profile:' + profileError.message)

        return Response.json({ error: 'User signed up but profile could not be created.' }, { status: 500 });
      }
    }

    return Response.json({ message: 'User created successfully.' }, { status: 201 });
  } catch (err) {
    console.error(err);
    return Response.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
