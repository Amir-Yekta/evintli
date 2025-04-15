import React from "react";
import Image from "next/image";
import Listing from "./listing"; // Adjust the import path as necessary
import { FaBirthdayCake } from "react-icons/fa";
import { IoMdNotificationsOutline } from "react-icons/io";

const ListingList = [
  {
    title: "Professional Wedding Ceremony",
    url: "https://images.pexels.com/photos/169198/pexels-photo-169198.jpeg?auto=compress&cs=tinysrgb&w=1200",
    company: "Trust Weddings",
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
    description: "Description for listing 2",
    category: "Birthday",
    capacity: 50,
    price: { min: 2000, max: 5000 },
    location: "Vancouver, Canada",
    staff: { min: 7, max: 10 },
  },
  {
    title: "Celebration of Life Ceremony",
    url: "https://images.pexels.com/photos/31568208/pexels-photo-31568208/free-photo-of-young-graduates-celebrating-with-flowers.jpeg?auto=compress&cs=tinysrgb&w=400",
    company: "Forever Young",
    description: "Description for listing 3",
    category: "Ceremony",
    price: { min: 5000, max: 7000 },
    capacity: 75,
    location: "Edmonton, Canada",
    staff: { min: 10, max: 15 },
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen min-w-md bg-gray-50">
      {/* Top Navigation Bar */}
      <header className="flex items-center justify-between gap-36 px-20 py-4 bg-white shadow-md">
        {/* Left: Company Name */}
        <div className="text-3xl font-bold">
          <div className="pb-1 border-x-3 w-6 mx-2"></div>
          <div className="pb-0.5 border-3 w-10"></div>
          <span className="px-2.5 border-3 border-b-gray-950 w-6 text-green-900">
            e
          </span>
          vintli
        </div>

        {/* Center: Search Bar */}
        <div className="mx-5 flex-1/3">
          <input
            type="text"
            placeholder="Search services, suppliers,..."
            className="w-9/12 px-4 py-2 border rounded-3xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Right: Add Listing Button */}
        <div className="flex items-center gap-4">
          <button className="px-4 py-2 text-white bg-gray-900 rounded-lg hover:bg-indigo-700">
            Add Listing
          </button>
          <IoMdNotificationsOutline className="text-4xl" />
          <Image
            src="/assets/profile.png"
            alt="Profile"
            height={40}
            width={40}
            className="w-10 h-10 rounded-full ml-4"
          />
        </div>
      </header>

      {/* Event Category Navigation */}

      <nav className="flex justify-center gap-4 py-4 bg-green-100">
        {["Home", "Wedding", "Birthday", "Ceremony", "Federal", "Others"].map(
          (event) => (
            <button
              key={event}
              className="px-4 py-2 text-2xl text-green-800 hover:text-green-950 hover:underline"
            >
              {event}
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
        <div className="grid gap-3 lg:grid-cols-2">
          {ListingList.map((listing, index) => (
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
