'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

export default function SignupPage() {
  const supabase = createSupabaseBrowserClient();
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    accepted: false,
  });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

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

    if (!form.accepted) {
      setError('You must accept the terms and conditions.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: form.email,
        password: form.password,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      setError(data.error || 'An error occurred during sign up.');
    } else {
      setMessage(data.message || 'Sign up successful! Please check your email if confirmation is required.');
      router.push('/login?message=signup_successful_check_email');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-900 to-teal-900">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <img src="/assets/Group 420047.svg" alt="Eventli Logo" className="h-10 mb-6 mx-auto" />
        <h1 className="text-2xl text-black font-bold mb-6 text-center">Create an account</h1>

        {/* Email */}
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 text-left mb-1 mt-1">Email</label>
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

        {/* Password */}
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 text-left mb-1 mt-1">Create a password</label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Create a password"
          value={form.password}
          onChange={handleChange}
          className="input placeholder-gray-500 text-black"
          required
        />

        {/* Confirm Password */}
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 text-left mb-1 mt-1">Re-enter your password</label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="Re-enter your password"
          value={form.confirmPassword}
          onChange={handleChange}
          className="input placeholder-gray-500 text-black"
          required
        />

        {/* Terms Agreement */}
        <label className="flex items-center text-sm my-3 mt-1">
          <input
            type="checkbox"
            name="accepted"
            checked={form.accepted}
            onChange={handleChange}
            className="mr-2"
            required
          />
          <p className='text-gray-400'>By creating an account, I agree to Eventli Inc’s
            <a href="#" className="text-blue-600 underline ml-1">Terms Of Service and Privacy Policy</a>
          </p>
        </label>

        {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
        {message && <p className="text-green-600 text-sm mb-2">{message}</p>}

        <button type="submit" className="bg-blue-600 text-white py-2 rounded w-full font-semibold">
          Sign-up
        </button>
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="mt-4 w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google sign-in" className="h-5 w-5 mr-2" />
          Sign up with Google
        </button>
        <p className="text-center text-sm mt-4 text-black">
          Already have an account? <a href="/login" className="text-blue-600 font-medium">Login</a>
        </p>
      </form>
    </div>
  );
}
