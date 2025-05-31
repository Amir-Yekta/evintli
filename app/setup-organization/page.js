'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function SetupOrganizationPage() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    companyName: '',
    companyEmail: '',
    phoneNumber: '',
    companyAddress: '',
  });
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
    // Basic validation example
    if (!form.firstName || !form.lastName || !form.companyName || !form.companyEmail) {
      setError('Please fill in all required fields.');
      return;
    }
    console.log('Organization setup form submitted:', form);
    setMessage('Organization information saved (simulated).');
    // router.push('/dashboard'); 
  };

  return (
    <div className="min-h-screen flex bg-white text-black">
      {/* Left Column: Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center p-4 sm:p-8 overflow-y-auto"> 
        <div className="mb-6 md:mb-8">
          <Image
            src="/Group 420047.svg" 
            alt="Eventli Logo"
            width={100} 
            height={38} 
            className="h-10" 
          />
        </div>
        <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto md:mx-0">
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 text-left mb-1">
            First Name:
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            value={form.firstName}
            onChange={handleChange}
            className="input placeholder-gray-400 text-black border-gray-300 focus:border-blue-500 focus:ring-blue-500 mb-2" 
            required
          />

          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 text-left mb-1 mt-2"> 
            Last Name:
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            value={form.lastName}
            onChange={handleChange}
            className="input placeholder-gray-400 text-black border-gray-300 focus:border-blue-500 focus:ring-blue-500 mb-2"
            required
          />

          <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 text-left mb-1 mt-2"> 
            Company Name:
          </label>
          <input
            id="companyName"
            name="companyName"
            type="text"
            value={form.companyName}
            onChange={handleChange}
            className="input placeholder-gray-400 text-black border-gray-300 focus:border-blue-500 focus:ring-blue-500 mb-2"
            required
          />

          <label htmlFor="companyEmail" className="block text-sm font-medium text-gray-700 text-left mb-1 mt-2"> 
            Company Email Address:
          </label>
          <input
            id="companyEmail"
            name="companyEmail"
            type="email"
            value={form.companyEmail}
            onChange={handleChange}
            className="input placeholder-gray-400 text-black border-gray-300 focus:border-blue-500 focus:ring-blue-500 mb-2"
            required
          />

          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 text-left mb-1 mt-2"> 
            Phone Number:
          </label>
          <input
            id="phoneNumber"
            name="phoneNumber"
            type="tel"
            value={form.phoneNumber}
            onChange={handleChange}
            className="input placeholder-gray-400 text-black border-gray-300 focus:border-blue-500 focus:ring-blue-500 mb-2"
          />

          <label htmlFor="companyAddress" className="block text-sm font-medium text-gray-700 text-left mb-1 mt-2"> 
            Address of your company:
          </label>
          <input
            id="companyAddress"
            name="companyAddress"
            type="text"
            value={form.companyAddress}
            onChange={handleChange}
            className="input placeholder-gray-400 text-black border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />

          {error && <p className="text-red-600 text-sm mt-3 mb-1">{error}</p>} 
          {message && <p className="text-green-600 text-sm mt-3 mb-1">{message}</p>}
          
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-10 rounded w-auto font-semibold mt-4"> 
            Save
          </button>
        </form>
      </div>

      {/* Right Column: Image */}
      <div className="hidden md:flex w-1/2 relative"> 
        <Image
          src="/assets/pexels-yankrukov-8867241 1.png"
          alt="Customer service representatives"
          fill 
          className="object-cover" 
          priority 
          sizes="50vw" 
        />
      </div>
    </div>
  );
}