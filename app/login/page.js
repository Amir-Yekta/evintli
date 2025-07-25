"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (!res.ok) return setError(data.error || 'Something went wrong');
    router.push('/home');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-900 to-teal-900">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <Image
          src="/Group 420047.svg"
          alt="Eventli Logo"
          width={100}
          height={100}
          className="h-10 mb-6 mx-auto"
        />
        <h1 className="text-2xl text-black font-bold mb-6 text-center">Login to your account</h1>

        <label htmlFor="email" className="block text-sm font-medium text-gray-700 text-left mb-1">
          Email
        </label>
        <input
          id="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="input placeholder-gray-500 text-black"
        />

        <label htmlFor="password" className="block text-sm font-medium text-gray-700 text-left mb-1 mt-4">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Re-enter your password"
            value={form.password}
            onChange={handleChange}
            className="input placeholder-gray-500 text-black pr-10"
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 pr-3 pb-3 flex items-center text-sm leading-5"
          >
            {showPassword ? <FaEyeSlash className="h-5 w-5 text-gray-500" /> : <FaEye className="h-5 w-5 text-gray-500" />}
          </button>
        </div>
        <div className="flex items-center justify-end mt-2">
          <a href="/forgot-password" className="text-sm text-blue-600 hover:underline">
            Forgot Password?
          </a>
        </div>
        {error && <p className="text-red-600 text-sm mb-2 mt-2">{error}</p>}
        <button className="bg-blue-600 text-white py-2 rounded w-full font-semibold mt-6">
          Login
        </button>
        <button
          type="button"
          className="mt-4 w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google sign-in"
            width={20}
            height={20}
            className="mr-2"
          />
          Sign in with Google
        </button>
        <p className="text-center text-black text-sm mt-4">
          Don’t have an account?{" "}
          <a href="/signup" className="text-blue-600 font-medium">
            Sign-up
          </a>
        </p>
      </form>
    </div>
  );
}