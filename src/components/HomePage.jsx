'use client';

import { useState } from 'react';
import Listing from './Listing';
// import { FaBirthdayCake } from 'react-icons/fa';
import { IoMdNotificationsOutline } from 'react-icons/io';
import { CiSearch } from 'react-icons/ci';
import { listingLists } from '../extras/listingLists';

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

  /**
   * Handle Searching
   *
   * @param {KeyboardEvent} event
   */
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
      <div className='flex items-center justify-between gap-36 px-20 py-4 bg-white shadow-md'>
        {/* Left: Company Name */}
        <img
          // className='relative w-[101px] h-[37px]'
          src='/Logo.svg'
          alt='Evintli Logo'
        />

        {/* Center: Search Bar */}
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

        {/* Right: Add Listing Button */}
        <div className='flex items-center gap-4'>
          <button className='px-4 py-2 text-white bg-gray-900 rounded-lg hover:bg-indigo-700'>
            Add Listing
          </button>
          <IoMdNotificationsOutline className='text-4xl' />
          <img
            src='assets/profile.png'
            alt='Profile'
            height={40}
            width={40}
            className='w-10 h-10 rounded-full ml-4'
          />
        </div>
      </div>

      {/* Event Category Navigation */}
      <nav className='flex justify-center gap-4 py-4 bg-green-100'>
        {['Home', 'Wedding', 'Birthday', 'Ceremony', 'Federal', 'Others'].map(
          category => (
            <button
              key={category}
              className='px-4 py-2 text-2xl text-green-800 hover:text-green-950 hover:underline'
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
      <main className='p-20'>
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
