'use client';

import logo from '../../public/logo.svg'
import bell from '../../public/bell.svg'
import profile from '../../public/profile.svg'
import { useState } from 'react';
import { CiSearch } from 'react-icons/ci';
import Listing from '../components/Listing';
// import { FaBirthdayCake } from 'react-icons/fa';
import { listingLists } from '../extras/listingLists';
import sty from './HomePage.module.css';
import Image from 'next/image';

export default function HomePage() {
  // State to manage the search query
  const [query, setQuery] = useState('');
  const [filteredListings, setFilteredListings] = useState(listingLists);

  // State to manage the selected navigation category
  const [selectedCategory, setSelectedCategory] = useState('Home');

  /** @param {string} category */
  function handleNavigation(category) {
    // Set the selected category
    console.log('Selected category: ' + selectedCategory);

    // const updatedListing = listingLists.filter(listing =>
    //   listing.category.toLocaleLowerCase() === category.toLocaleLowerCase()
    // );

    if (category === 'Home') setSelectedCategory('Home');
    else setSelectedCategory(category);
  }

  /** @param {KeyboardEvent} event */
     function handleKeyDown(event) {
    if (event.key === 'Enter') {
      // Perform search action
      console.log('Search for:', query);

      const updatedListingTitle = listingLists.filter(listing =>
        listing.title.toLowerCase().includes(query.toLowerCase())
      );

      const updatedListingCompany = listingLists.filter(listing =>
        listing.company.toLowerCase().includes(query.toLowerCase())
      );

      const updatedListingCategory = listingLists.filter(listing =>
        listing.category.toLowerCase().includes(query.toLowerCase())
      );

      // update listing combine of both matching title, company and category
      const updatedListing = [
        ...updatedListingTitle,
        ...updatedListingCategory,
        ...updatedListingCompany
      ];

      setFilteredListings([...new Set(updatedListing)]); // to set: take unique values, then backed to array
      setQuery(''); // Clear the search input
    }
  }

  return (
    <div className='min-h-screen min-w-md bg-gray-50'>
      {/* Top Navigation Bar */}
      <div className='flex flex-auto items-center justify-between gap-x-60 px-20 py-4 bg-white shadow-md'>
        {/* Left: Company Name */}
        <Image
          className='relative'
          id='logo'
          src={logo}
          alt='Evintli Logo'
          width={101}
          height={37}
        />

        {/* Center: Search Bar */}
        {/* NOTE: This is not complete, it needs more styling */}
        {/* TODO: Implement the appearence from Figma design */}
        <div className='flex mx-5 flex-1/3'>
          <div className='relative w-full'>
            <input
              type='text'
              placeholder='Search services, suppliers,...'
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className='w-full pl-12 pr-4 py-2 border rounded-3xl focus:outline-none focus:ring-2 focus:ring-indigo-500'
            />
            <CiSearch className='absolute left-4 top-1/2 transform -translate-y-1/2 text-xl text-gray-500' />
          </div>
        </div>

        {/* Right Section */}
        <div className='relative flex flex-[3%] flex-row items-center gap-x-4'>
          <button className='px-4 py-2 text-white bg-gray-900 rounded-lg hover:bg-indigo-700'>
            Add Listing
          </button>
          <div
            className={`${sty.notification} top-[0.5px] left-[0.5rem] shadow-effect`}
            id='notifications'
          >
            <Image
              className='relative top-[7.5px] left-[8px]'
              id='bell'
              src={bell}
              alt='bell'
              width={24}
              height={25}
            />
          </div>
          <div
            className={`${sty.profile} top-[0.5px] left-[0.5rem] shadow-effect`}
            id='profile'
          >
            <Image
              className='relative top-[7.5px] left-[8px]'
              id='profile'
              alt='Profile'
              src={profile}
              width={22}
              height={23}
            />
          </div>
        </div>
      </div>

      <div className='relative w-fit h-[3px] bg-[#f1f1f1] mb-1 shadow-effect' id='expansive-menu'></div>

      {/* Event Category Navigation */}
      {/* NOTE: This is not complete, it needs more styling */}
      <nav className='flex justify-center gap-4 py-4' id='categories'>
        {['Home', 'Wedding', 'Birthday', 'Ceremony', 'Federal', 'Others'].map(
          category => (
            <button
              key={category}
              className='px-4 py-2 text-2xl text-black hover:text-[#008080] hover:underline'
              onClick={() => {
                setSelectedCategory(category);
                handleNavigation(category);
              }}
            >
              {category}
            </button>
          )
        )}
      </nav>

      {/* Main Body - Listings */}
      <main className='p-20' id='listings'>
        <h2 className='mb-4 text-xl font-semibold text-gray-800'>
          Event Listings
        </h2>

        {/* Add more listing cards as needed */}
        <div className='grid gap-5 lg:grid-cols-2 items-center'>
          {filteredListings.map((listing, index) => (
            <Listing key={index} {...listing} />
          ))}
        </div>
      </main>
    </div>
  );
}
