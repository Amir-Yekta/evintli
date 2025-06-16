// File: app/update-password/page.js
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!password) {
      setError('Password cannot be empty.');
      return;
    }
    
    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError(updateError.message);
    } else {
      setMessage('Your password has been updated successfully!');
      setTimeout(() => router.push('/login'), 3000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-900 to-teal-900">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl text-black font-bold mb-6 text-center">Update Your Password</h1>
        
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 text-left mb-1">New Password</label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input placeholder-gray-500 text-black"
          required
        />
        
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 text-left mb-1 mt-4">Confirm New Password</label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="Re-enter new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="input placeholder-gray-500 text-black"
          required
        />

        {error && <p className="text-red-600 text-sm mt-2 mb-2">{error}</p>}
        {message && <p className="text-green-600 text-sm mt-2 mb-2">{message}</p>}
        
        <button type="submit" className="bg-blue-600 text-white py-2 rounded w-full font-semibold mt-6">
          Update Password
        </button>
      </form>
    </div>
  );
}