// app/api/auth/signup/route.js
import { createSupabaseServerClient } from '@/lib/supabase/server'; // Path to your server client

export async function POST(req) {
  const supabase = await createSupabaseServerClient(); // Added await
  try {
    // Only expect email and password from the request
    const { email, password } = await req.json();
    // Variables name, role, companyName will be undefined

    // --- Input Validations ---
    if (!email || !password) {
      return Response.json({ error: 'Email and password are required.' }, { status: 400 });
    }
    // Removed validation for name
    // Removed validation for role
    // Removed validation for companyName
    // --- End Input Validations ---

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          // name will be undefined here, and thus passed as such to the trigger
          // role will be (undefined || 'CUSTOMER') which is 'CUSTOMER'
          // company_name will be (undefined === 'SELLER' ? undefined : undefined) which is undefined
          // full_name will be undefined
          // This matches the desired state of not collecting these at signup
          name: undefined, // Explicitly undefined, or remove if trigger handles missing keys
          role: 'CUSTOMER', // Default role
          company_name: undefined, // Explicitly undefined, or remove
          full_name: undefined, // Explicitly undefined, or remove
          avatar_url: null,
        },
       email_redirect_to: `${new URL(req.url).origin}/api/auth/callback?next=/dashboard`
      }
    });

    if (signUpError) {
      console.error('Supabase Signup Error:', signUpError.message, signUpError.status);
      if (signUpError.message.includes("User already registered") || signUpError.status === 409 || signUpError.status === 422 ) {
        return Response.json({ error: 'User already exists with this email.' }, { status: 409 });
      }
      return Response.json({ error: signUpError.message || "Could not sign up user." }, { status: signUpError.status || 400 });
    }

    let message = 'Signup request processed.';
    if (signUpData.user && signUpData.user.identities && signUpData.user.identities.length > 0 && !signUpData.session) {
        message = 'Signup successful! Please check your email to confirm your account.';
    } else if (signUpData.user && signUpData.session) {
        message = 'Signup successful and user created!';
    } else if (!signUpData.user && !signUpData.session) {
        message = 'If your email is already registered but unconfirmed, please check your inbox for a confirmation link.';
    }

    // Note: If you were previously relying on a trigger to populate the 'profiles' table
    // using 'name', 'role', 'company_name' from user_metadata, ensure that
    // your 'profiles' table columns for name and company_name are nullable,
    // and the trigger correctly handles potentially missing metadata.
    // The role will be set to 'CUSTOMER'.

    return Response.json({ message, user: signUpData.user }, { status: 201 });

  } catch (err) {
    console.error('API Signup Route General Error:', err);
    // Ensure err.message is accessed safely
    const errorMessage = err instanceof Error ? err.message : 'Internal server error during signup.';
    return Response.json({ error: errorMessage }, { status: 500 });
  }
}