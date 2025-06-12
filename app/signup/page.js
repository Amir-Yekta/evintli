'use client';

import { supabase } from '../../lib/supabase';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useState } from 'react';
import googleLogo from '../../public/google_g_logo.svg'
import logo from '../../public/logo.svg'

export default function SignupPage() {
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    accepted: false,
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  /** @param {Event} e */
  function handleChange(e) {
    // This applies to all the properties of the Event object
    /** @type {HTMLInputElement} */
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);
  
  /** @param {Event} e */
  async function handleSubmit(e) {
    e.preventDefault(); //prevent page refresh
    setError(''); //reset errors

    if (!form.accepted) {
      return setError('You must accept the terms.');
    }
    if (form.password !== form.confirmPassword) {
      return setError('Passwords do not match.');
    }
    // validate form
    if (!form.email || !form.password || !form.confirmPassword)
        return setError('Please fill in all fields.');

    if (form.password !== form.confirmPassword)
        return setError('Passwords do not match.');

    if (!form.accepted)
        return setError('You must accept the terms and conditions.');

    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(form)
    })

    /** @type {{ error: string }} */
    const data = await res.json();

    if (!res.ok)
      return setError(data.error || 'Something went wrong');

    router.push('/login');
  }

  async function handleGoogleSignIn() {
    setError('')
    const { /* data, */ error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/home` }
    });

    if (error) setError(error.message)
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-green-900 to-teal-900'>
      <form onSubmit={handleSubmit} className='bg-white p-8 rounded-2xl shadow-lg w-full max-w-md'>
        <Image src={logo} alt='Eventli Logo' className='h-10 mb-6 mx-auto' width={101} height={37} />
        <h1 className='text-2xl text-black font-bold mb-6 text-center'>Create an account</h1>

        <label htmlFor="email" className="block text-sm font-medium text-gray-700 text-left mb-1 mt-1">
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

        <label htmlFor="password" className="block text-sm font-medium text-gray-700 text-left mb-1 mt-1">
          Create a password
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Create a password"
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

        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 text-left mb-1 mt-1">
          Re-enter your password
        </label>
        <div className="relative">
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Re-enter your password"
            value={form.confirmPassword}
            onChange={handleChange}
            className="input placeholder-gray-500 text-black pr-10"
          />
          <button
            type="button"
            onClick={toggleConfirmPasswordVisibility}
            className="absolute inset-y-0 right-0 pr-3 pb-3 flex items-center text-sm leading-5"
          >
            {showConfirmPassword ? <FaEyeSlash className="h-5 w-5 text-gray-500" /> : <FaEye className="h-5 w-5 text-gray-500" />}
          </button>
        </div>

        <label className="flex items-center text-sm my-3 mt-1">
          <input
            type="checkbox"
            name="accepted"
            checked={form.accepted}
            onChange={handleChange}
            className="mr-2"
          />
          <p className="text-gray-400">
            By creating an account, I agree to Eventli Inc’s
            <a className="text-blue-600 underline ml-1">Terms Of Service and Privacy Policy</a>
          </p>
        </label>

        {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

        <button className="bg-blue-600 text-white py-2 rounded w-full font-semibold">Sign-up</button>

        <button
          type='button'
          className='mt-4 w-full flex items-center justify-center py-2 px-4 border border-gray-300
            rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50'
          onClick={handleGoogleSignIn}
        >
          <Image
            src={googleLogo}
            alt='Sign in with Google'
            className='h-5 w-5 mr-2'
            id='google-sign-in'
            width={80}
            height={80}
          />
          Sign up with Google
        </button>
        <p className='text-center text-sm mt-4 text-black'>
          Already have an account? <a href='/login' className='text-blue-600 font-medium'>Login</a>
        </p>
      </form>
    </div>
  );
};
