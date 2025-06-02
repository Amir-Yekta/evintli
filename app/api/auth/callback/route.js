// app/api/auth/callback/route.js
import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server'; // Updated import

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || '/dashboard';

  if (code) {
    const supabase = createSupabaseServerClient();
    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        console.error('Error exchanging OAuth code for session:', error.message);
        const loginUrl = new URL('/login', requestUrl.origin);
        loginUrl.searchParams.set('error', 'OAuth callback failed');
        loginUrl.searchParams.set('message', encodeURIComponent(error.message));
        return NextResponse.redirect(loginUrl);
      }
    } catch (errorCatch) { // Use a different variable name for the catch block error
      console.error('Catch block: Error exchanging code for session:', errorCatch.message);
      const loginUrl = new URL('/login', requestUrl.origin);
      loginUrl.searchParams.set('error', 'OAuth callback exception');
      loginUrl.searchParams.set('message', encodeURIComponent(errorCatch.message));
      return NextResponse.redirect(loginUrl);
    }
  } else {
    console.warn('OAuth callback called without a code.');
    const loginUrl = new URL('/login', requestUrl.origin);
    loginUrl.searchParams.set('error', 'OAuth missing code');
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.redirect(new URL(next, requestUrl.origin).toString());
}