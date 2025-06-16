"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Listing from "./listing"; // Adjust the import path as necessary
import { FaBirthdayCake } from "react-icons/fa";
import { IoMdNotificationsOutline } from "react-icons/io";
import { CiSearch } from "react-icons/ci";

const listingLists = [
  {
    title: "Professional Wedding Ceremony",
    url: "https://images.pexels.com/photos/169198/pexels-photo-169198.jpeg?auto=compress&cs=tinysrgb&w=1200",
    company: "Trust Weddings Inc.",
    description:
      "At Trust Weddings, we specialize in creating unforgettable wedding experiences tailored to your unique love story. From intimate gatherings to grand celebrations, our team of experienced professionals is dedicated to bringing your vision to life with precision, creativity, and care. We offer comprehensive planning, stunning décor, premium vendor coordination, and day-of event management—ensuring a seamless and stress-free journey from “Yes” to “I Do.” Let us handle the details so you can focus on making beautiful memories.",
    category: "Wedding",
    capacity: 100,
    price: { min: 5000, max: 10000 },
    location: "Calgary Northwest, Canada ",
    staff: { min: 12, max: 20 },
  },
  {
    title: "Birthday Celebration Extravaganza",
    url: "https://images.pexels.com/photos/17931321/pexels-photo-17931321/free-photo-of-portrait-of-a-quinceanera-posing-at-her-birthday-party.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    company: "Event Guys",
    description:
      "Celebrate life’s milestones in style with our personalized birthday party services. From intimate gatherings to grand celebrations, we provide venue setup, themed decorations, catering, entertainment, and coordination to make every birthday unforgettable for guests of all ages.",
    category: "Birthday",
    capacity: 50,
    price: { min: 2000, max: 5000 },
    location: "Vancouver, Canada",
    staff: { min: 7, max: 10 },
  },
  {
    title: "Celebration of Life",
    url: "https://images.pexels.com/photos/31568208/pexels-photo-31568208/free-photo-of-young-graduates-celebrating-with-flowers.jpeg?auto=compress&cs=tinysrgb&w=400",
    company: "Forever Memories",
    description:
      "Whether you're planning a cultural, spiritual, or civil ceremony, our team ensures every detail reflects your values and traditions. We offer comprehensive planning, elegant décor, venue styling, and ceremonial coordination tailored to your unique vision and purpose.",
    category: "Ceremony",
    price: { min: 5000, max: 7000 },
    capacity: 75,
    location: "Edmonton, Canada",
    staff: { min: 10, max: 15 },
  },
  {
    title: "Federal Event Planning",
    url: "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=400",
    company: "GovEvents",
    description:
      "Our funeral services are designed to provide comfort, dignity, and respect during times of loss. We assist with planning, floral arrangements, venue setup, audio-visual tributes, and support services, creating a heartfelt farewell that honors the memory of your loved one.",
    category: "Federal",
    capacity: 200,
    price: { min: 10000, max: 20000 },
    location: "Ottawa, Canada",
    staff: { min: 20, max: 30 },
  },
];

export default function HomePage() {
  // State to manage the search query
  const [query, setQuery] = useState('');
  const [filteredListings, setFilteredListings] = useState(listingLists);
  const [mounted, setMounted] = useState(false);

  // State to manage the selected navigation category
  const [selectedCategory, setSelectedCategory] = useState('Home');

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return null;
  }

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
    <div className="min-h-screen min-w-md bg-gray-50">
      {/* Top Navigation Bar */}
      <div className='flex flex-auto items-center justify-between gap-x-60 px-20 py-4 bg-white shadow-md'>
        {/* Left: Company Name */}        <Image
          className='relative'
          id='logo'
          src="/logo.svg"
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
          </button>          <div
            className="relative w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:shadow-xl transition-shadow"
            id='notifications'
          >            <Image
              className='relative'
              id='bell'
              src="/bell.svg"
              alt='bell'
              width={24}
              height={25}
            />
          </div>
          <div
            className="relative w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:shadow-xl transition-shadow"
            id='profile'
          >            <Image
              className='relative'
              id='profile'
              alt='Profile'
              src="/profile.svg"
              width={22}
              height={23}
            />
          </div>
        </div>
      </div>

      {/* Event Category Navigation */}

      <nav className="flex justify-center gap-4 py-4 bg-green-100">
        {["Home", "Wedding", "Birthday", "Ceremony", "Federal", "Others"].map(
          (category) => (
            <button
              key={category}
              className="px-4 py-2 text-2xl text-green-800 hover:text-green-950 hover:underline"
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
      <main className="p-20">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">
          Event Listings
        </h2>

        {/* Add more listing cards as needed */}
        <div className="grid gap-5 lg:grid-cols-2 items-center">
          {filteredListings.map((listing, index) => (
            <Listing
              key={index}
              title={listing.title}
              url={listing.url}
              company={listing.company}
              description={listing.description}
              category={listing.category}
              capacity={listing.capacity}
              price={listing.price}
              location={listing.location}
              staff={listing.staff}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
