'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ForgotPasswordPage() {
  const [form, setForm] = useState({ email: '', newPassword: '', confirmNewPassword: '' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!form.email || !form.newPassword || !form.confirmNewPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (form.newPassword !== form.confirmNewPassword) {
      setError('New passwords do not match.');
      return;
    }

    // Since no backend is needed, we'll just simulate a success
    console.log('Password reset form submitted:', form);
    setMessage('If an account with this email exists, a password reset link has been sent (simulated).');
    setForm({ email: '', newPassword: '', confirmNewPassword: '' });
    // Optionally, redirect or show a more persistent success message
    // router.push('/login'); 
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-900 to-teal-900">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <img src="/Group 420047.svg" alt="Eventli Logo" className="h-10 mb-6 mx-auto" />
        <h1 className="text-2xl text-black font-bold mb-6 text-center">Reset Your Password</h1>

        <label htmlFor="email" className="block text-sm font-medium text-gray-700 text-left mb-1">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="Enter your email"
          value={form.email}
          onChange={handleChange}
          className="input placeholder-gray-500 text-black"
        />

        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 text-left mb-1 mt-4">New Password</label>
        <input
          id="newPassword"
          name="newPassword"
          type="password"
          placeholder="Enter new password"
          value={form.newPassword}
          onChange={handleChange}
          className="input placeholder-gray-500 text-black"
        />

        <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700 text-left mb-1 mt-4">Confirm New Password</label>
        <input
          id="confirmNewPassword"
          name="confirmNewPassword"
          type="password"
          placeholder="Re-enter new password"
          value={form.confirmNewPassword}
          onChange={handleChange}
          className="input placeholder-gray-500 text-black"
        />

        {error && <p className="text-red-600 text-sm mt-2 mb-2">{error}</p>}
        {message && <p className="text-green-600 text-sm mt-2 mb-2">{message}</p>}
        
        <button type="submit" className="bg-blue-600 text-white py-2 rounded w-full font-semibold mt-6">
          Reset Password
        </button>

        <p className="text-center text-black text-sm mt-4">
          Remembered your password? <a href="/login" className="text-blue-600 font-medium">Login</a>
        </p>
      </form>
    </div>
  );
}