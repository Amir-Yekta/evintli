'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const supabase = createSupabaseBrowserClient();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const urlMessage = searchParams.get('message');
    const urlError = searchParams.get('error');
    if (urlMessage) {
      if (urlMessage === 'signup_successful_check_email') {
        setMessage('Signup successful! Please check your email if confirmation is required, then log in.');
      } else {
        setMessage(decodeURIComponent(urlMessage));
      }
    }
    if (urlError) {
      setError(decodeURIComponent(urlError));
    }
  }, [searchParams]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleGoogleSignIn = async () => {
    setError('');
    setMessage('');
    const { error: signInError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback?next=/dashboard`,
      },
    });
    if (signInError) setError(signInError.message);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error || 'Invalid login credentials.');
    } else {
      setMessage('Login successful! Redirecting...');
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-900 to-teal-900">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <img src="/assets/Group 420047.svg" alt="Eventli Logo" className="h-10 mb-6 mx-auto" />
        <h1 className="text-2xl text-black font-bold mb-6 text-center">Login to your account</h1>

        {message && <p className="text-green-600 text-sm mb-4 text-center">{message}</p>}
        {error && <p className="text-red-600 text-sm mb-4 text-center">{error}</p>}

        <label htmlFor="email" className="block text-sm font-medium text-gray-700 text-left mb-1">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="input placeholder-gray-500 text-black"
          required
        />

        <label htmlFor="password" className="block text-sm font-medium text-gray-700 text-left mb-1 mt-4">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="input placeholder-gray-500 text-black"
          required
        />

        <div className="flex items-center justify-end mt-2">
          <a href="/forgot-password" className="text-sm text-blue-600 hover:underline">
            Forgot Password?
          </a>
        </div>

        <button type="submit" className="bg-blue-600 text-white py-2 rounded w-full font-semibold mt-6">
          Login
        </button>
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="mt-4 w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google sign-in" className="h-5 w-5 mr-2" />
          Sign in with Google
        </button>
        <p className="text-center text-black text-sm mt-4">
          Don’t have an account?{' '}
          <a href="/signup" className="text-blue-600 font-medium">
            Sign-up
          </a>
        </p>
      </form>
    </div>
  );
}
