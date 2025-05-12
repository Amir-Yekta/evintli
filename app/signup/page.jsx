'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SignupPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    accepted: false
  });
  const [error, setError] = useState('');
  const router = useRouter();

  /** @param {Event} e */
  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  }

  /** @param {Event} e */
  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.accepted)
      return setError('You must accept the terms.');

    if (form.password !== form.confirmPassword)
        return setError('Passwords do not match.');

    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        password: form.password
      })
    });

    const data = await res.json();
    if (!res.ok) return setError(data.error || 'Something went wrong.');

    router.push('/login');
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-green-900 to-teal-900'>
      <form
        onSubmit={handleSubmit}
        className='bg-white p-8 rounded-2xl shadow-lg w-full max-w-md'
      >
        <h1 className='text-2xl text-black font-bold mb-6 text-center'>
          Create an account
        </h1>
        <input
          name='name'
          placeholder='Full name'
          value={form.name}
          onChange={handleChange}
          className='input placeholder-gray-500 text-black'
        />

        <input
          name='email'
          placeholder='Email'
          value={form.email}
          onChange={handleChange}
          className='input placeholder-gray-500 text-black'
        />

        <input
          name='password'
          type='password'
          placeholder='Create a password'
          value={form.password}
          onChange={handleChange}
          className='input placeholder-gray-500 text-black'
        />

        <input
          name='confirmPassword'
          type='password'
          placeholder='Re-enter your password'
          value={form.confirmPassword}
          onChange={handleChange}
          className='input placeholder-gray-500 text-black'
        />

        <label className='flex items-center text-sm my-3'>
          <input
            type='checkbox'
            name='accepted'
            checked={form.accepted}
            onChange={handleChange}
            className='mr-2 '
          />

          <p className='text-gray-400'>
            By creating an account, I agree to Eventli Inc’s
            <a className='text-blue-600 underline ml-1'>
              Terms Of Service and Privacy Policy
            </a>
          </p>
        </label>

        {error && <p className='text-red-600 text-sm mb-2'>{error}</p>}

        <button className='bg-blue-600 text-white py-2 rounded w-full font-semibold'>
          Sign-up
        </button>
        <p className='text-center text-sm mt-4 text-black'>
          Already have an account?{' '}
          <a href='/login' className='text-blue-600 font-medium'>
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
