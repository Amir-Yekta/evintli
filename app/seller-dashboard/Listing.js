"use client"

import { useState, useEffect } from "react"
import { FiPlus, FiEdit, FiTrash2, FiArrowLeft } from "react-icons/fi"
import { createListing } from "../lib/services/listing_crud"
import { getUserListings, updateListing, deleteListing } from "../lib/services/listing_crud"
import { useSession } from "@supabase/auth-helpers-react"
import { uploadImage } from "../lib/services/listing_crud"

export default function ListingSection() {
  const [currentView, setCurrentView] = useState("dashboard") // 'dashboard', 'add', 'edit', 'editForm', 'delete'
  const [selectedListing, setSelectedListing] = useState(null) 
  const [imagePreview, setImagePreview] = useState(null)
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [refresh, setRefresh] = useState(false)

  const session = useSession();

//Handle for creating a form submission to create a new listing
  const handleCreateListing = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const file = formData.get("image"); //get image file form formData
    let image_url = null;

    //Checking if user is logged in
     if (!session?.user?.id) {
        alert("User not logged in.");
        return;
      }

    //Upload image if provided
      if (file instanceof File && file.size > 0) {
        const { url, error } = await uploadImage(file, user.id);
        if (error) return console.error(error);
        image_url = url;
      }

      formData.set("image_url", image_url);
      formData.delete("image"); //Remove raw file from formData

      const { data, error } = await createListing(formData, session?.user?.id);

    //Error handling
      if (error) {
        console.error("Error creating listing:", error);
        alert("There was an error creating the listing.");
      } else {
        alert("Listing created successfully!");
        handleBackToDashboard();
      }
    }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleEditListing = (listing) => {
    console.log("Edit listing:", listing)
    setCurrentView("editForm")
    setSelectedListing(listing) 
  }


  //handles the form submission for updating a listing
  const handleUpdateListing = async (e, listingId) => {
    e.preventDefault()

    const formData = new FormData(e.target)
      
    const updatedListing = {
      title: formData.get("title"),
      city: formData.get("city"),
      address: formData.get("address"),
      price_range: formData.get("priceRange"),
      event_type: formData.get("eventType"),
      serving_style: formData.get("servingStyle"),
      num_of_staff: Number(formData.get("numOfStaff")),
      num_of_guests: Number(formData.get("numOfGuests")),
      description: formData.get("description"),
      image_url: formData.get("image_url") || null, // optional
    }

    const { data, error } = await updateListing(listingId, updatedListing)

    if (error) {
      console.error("Update failed:", error.message)
      alert("There was an error updating the listing.")
    } else {
      console.log("Listing successfully updated")
      alert("Listing updated successfully!")
      setCurrentView("edit")
      setSelectedListing(null)
      setImagePreview(null) 
      setRefresh(true)
    }
  }

useEffect(() => { //updates the UI after use edits their listing
  const fetchUpdatedListings = async () => {
    const id = session?.user?.id;
    const { data, error } = await getUserListings(id);

    if (error) {
      console.error("Error fetching updated listings:", error.message);
    } else {
      setListings(data || []);
    }

    setRefresh(false); //reset
  };

  if (refresh) {
    fetchUpdatedListings();
  }
}, [refresh]);

  
  const handleCancelEdit = () => {
    setCurrentView("edit")
    setSelectedListing(null)
    setImagePreview(null)
  }

  const handleDeleteListing = async (listing) => {
    console.log("Delete listing:", listing)
    setSelectedListing(listing) 

    //final confimation
    const confirmed = confirm(`Are you sure you want to delete the listing "${listing.title}"? This action cannot be undone.`);
    if (!confirmed) return;

    //delete listing
    const { error } = await deleteListing(listing.id);

    //Error handling
    if (error) {
      console.error("Error deleting listing:", error);
      alert("There was an error deleting the listing.");
    } else {
      alert("Listing deleted successfully!");
      setListings(listings.filter((l) => l.id !== listing.id));
      setCurrentView("dashboard");
    }
  }

  const handleBackToDashboard = () => {
    setCurrentView("dashboard")
    setImagePreview(null)
  }

  useEffect(() => { //2 changes for testing
    const fetchListings = async () => {
      setLoading(true);

      const id = session?.user?.id || "df64e4c5-5379-430b-b91f-c63f1dde6eec";
      const { data, error } = await getUserListings(id);

      if (error) {
        console.error("Error fetching listings:", error);
      } else {
        console.log("Fetched listings:", data);
        setListings(data || []);
      }

      setLoading(false);
    };

    //if (session) {
      fetchListings();
    //}
  }, [session]);


  // Dashboard view with action buttons
  const renderDashboard = () => (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 mt-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Manage Your Listings</h1>
        <p className="text-gray-600">Choose an action to manage your catering listings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Add Listing Card */}
        <div className="rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 shadow-lg bg-gradient-to-br from-green-50 to-teal-50">
          <div className="text-center p-6 pb-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
              <FiPlus className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Add New Listing</h3>
            <p className="text-gray-600 mt-1">Create a new catering listing for your services</p>
          </div>
          <div className="text-center px-6 pb-6 pt-0">
            <button
              className="cursor-pointer w-full py-2 px-4 rounded-md bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              onClick={() => setCurrentView("add")}
            >
              Create Listing
            </button>
          </div>
        </div>

        {/* Edit Listing Card */}
        <div className="rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="text-center p-6 pb-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
              <FiEdit className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Edit Listings</h3>
            <p className="text-gray-600 mt-1">Modify your existing catering listings</p>
          </div>
          <div className="text-center px-6 pb-6 pt-0 mt-6">
            <button
              className="cursor-pointer w-full py-2 px-4 rounded-md border-2 border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white shadow-lg hover:shadow-xl transition-all duration-200"
              onClick={() => setCurrentView("edit")}
            >
              Edit Listings
            </button>
          </div>
        </div>

        {/* Delete Listing Card */}
        <div className="rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 shadow-lg bg-gradient-to-br from-red-50 to-pink-50">
          <div className="text-center p-6 pb-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
              <FiTrash2 className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Delete Listings</h3>
            <p className="text-gray-600 mt-1">Remove listings that are no longer available</p>
          </div>
          <div className="text-center px-6 pb-6 pt-0 mt-6">
            <button
              className="cursor-pointer w-full py-2 px-4 rounded-md border-2 border-red-500 text-red-600 hover:bg-red-500 hover:text-white shadow-lg hover:shadow-xl transition-all duration-200"
              onClick={() => setCurrentView("delete")}
            >
              Manage Deletions
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  // Add listing form
  const renderAddListing = () => (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center mb-6">
        <button
          onClick={handleBackToDashboard}
          className="cursor-pointer flex items-center mr-4 py-2 px-4 rounded-md hover:bg-green-100 text-green-700 hover:text-green-800 transition-all duration-200"
        >
          <FiArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </button>
        <h2 className="text-3xl font-bold text-gray-800">Create New Listing</h2>
      </div>

      <div className="rounded-lg shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 overflow-hidden">
        <div className="p-8">
          <form className="space-y-6" onSubmit={handleCreateListing}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left column */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-semibold text-gray-700">
                    Title
                  </label>
                  <input
                    id="title"
                    name="title"
                    placeholder="Enter event title"
                    className="w-full p-3 border-2 border-gray-200 rounded-lg text-gray-800 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="city" className="text-sm font-semibold text-gray-700">
                      City
                    </label>
                    <input
                      id="city"
                      name="city"
                      placeholder="Enter city"
                      className="w-full p-3 border-2 border-gray-200 rounded-lg text-gray-800 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="address" className="text-sm font-semibold text-gray-700">
                      Address
                    </label>
                    <input
                      id="address"
                      name="address"
                      placeholder="Enter address"
                      className="w-full p-3 border-2 border-gray-200 rounded-lg text-gray-800 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="priceRange" className="text-sm font-semibold text-gray-700">
                    Price Range
                  </label>
                  <input
                    id="priceRange"
                    name="priceRange"
                    placeholder="e.g. $1000-$2000"
                    className="w-full p-3 border-2 border-gray-200 rounded-lg text-gray-800 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="eventType" className="text-sm font-semibold text-gray-700">
                    Event Type
                  </label>
                  <input
                    id="eventType"
                    name="eventType"
                    placeholder="e.g. Wedding, Corporate, Birthday"
                    className="w-full p-3 border-2 border-gray-200 rounded-lg text-gray-800 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Right column */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="servingStyle" className="text-sm font-semibold text-gray-700">
                    Serving Style
                  </label>
                  <input
                    id="servingStyle"
                    name="servingStyle"
                    placeholder="e.g. Buffet, Plated, Family Style"
                    className="w-full p-3 border-2 border-gray-200 rounded-lg text-gray-800 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="numOfStaff" className="text-sm font-semibold text-gray-700">
                      Number of Staff
                    </label>
                    <input
                      id="numOfStaff"
                      name="numOfStaff"
                      type="number"
                      placeholder="Enter number"
                      className="w-full p-3 border-2 border-gray-200 rounded-lg text-gray-800 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="numOfGuests" className="text-sm font-semibold text-gray-700">
                      Number of Guests
                    </label>
                    <input
                      id="numOfGuests"
                      name="numOfGuests"
                      type="number"
                      placeholder="Enter number"
                      className="w-full p-3 border-2 border-gray-200 rounded-lg text-gray-800 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-semibold text-gray-700">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    placeholder="Describe your event details"
                    className="min-h-[120px] resize-none w-full p-3 border-2 border-gray-200 rounded-lg text-gray-800 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Image upload section */}
            <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-teal-50 rounded-lg border-2 border-green-100">
              <div className="space-y-3">
                <label htmlFor="image" className="text-sm font-semibold text-gray-700">
                  Upload an Image
                </label>
                <div className="flex items-start gap-6">
                  <div className="flex-1">
                    <input
                      type="file"
                      id="image_url"
                      name="image_url"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="cursor-pointer w-full p-3 border-2 border-gray-200 rounded-lg bg-white"
                    />
                  </div>
                  {imagePreview && (
                    <div className="w-32 h-32 rounded-lg overflow-hidden border-2 border-green-200 shadow-lg">
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Form actions */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleBackToDashboard}
                className="cursor-pointer px-8 py-3 rounded-md border-2 border-gray-300 text-gray-600 hover:bg-gray-100 transition-all duration-200"
              >
                Cancel
              </button>
              <div className="flex-1">{/* Space reserved for terms and conditions */}</div>
              <button
                type="submit"
                className="cursor-pointer px-8 py-3 rounded-md bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Create Listing
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )

  // Edit listings view
  const renderEditListings = () => (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center mb-6">
        <button
          onClick={handleBackToDashboard}
          className="cursor-pointer flex items-center mr-4 py-2 px-4 rounded-md hover:bg-green-100 text-green-700 hover:text-green-800 transition-all duration-200"
        >
          <FiArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </button>
        <h2 className="text-3xl font-bold text-gray-800">Edit Your Listings</h2>
      </div>

      <div className="rounded-lg shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-t-lg">
          <h3 className="text-2xl font-bold">Your Listings</h3>
          <p className="text-blue-100">Select a listing to edit</p>
        </div>
        <div className="p-8"> 
          {loading ? (
            <p className="text-gray-600">Loading your listings...</p>
          ) : listings.length === 0 ? (
            <p className="text-gray-600 text-lg">You have no listings yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {listings.map((listing) => (
                <div key={listing.id} className="bg-white rounded-lg p-4 shadow-md border hover:shadow-lg transition duration-200">
                  <h4 className="text-xl font-semibold text-gray-800">{listing.title}</h4>
                  <p className="text-gray-600 mt-1">{listing.description?.slice(0, 80)}...</p>
                  <button
                    onClick={() => handleEditListing(listing)}
                    className="mt-4 inline-flex items-center px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition"
                  >
                    <FiEdit className="mr-2" /> Edit
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )

  // Edit Listing Form View
  const renderEditListingForm = (listing) => (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center mb-6">
        <button
          onClick={handleBackToDashboard}
          className="cursor-pointer flex items-center mr-4 py-2 px-4 rounded-md hover:bg-green-100 text-green-700 hover:text-green-800 transition-all duration-200"
        >
          <FiArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </button>
        <h2 className="text-3xl font-bold text-gray-800">Edit Listing: {listing.title}</h2>
      </div>

      {/* Form similar to Add Listing but pre-filled with listing data */}
      <div className="rounded-lg shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 overflow-hidden">
        <div className="p-8">
          <form className="space-y-6" onSubmit={(e) => handleUpdateListing(e, listing.id)}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left column */}
              <div className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-semibold text-gray-700">Title</label>
                  <input
                    id="title"
                    name="title"
                    defaultValue={listing.title}
                    className="w-full p-3 border-2 border-gray-200 rounded-lg text-gray-800 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* City */}
                  <div className="space-y-2">
                    <label htmlFor="city" className="text-sm font-semibold text-gray-700">City</label>
                    <input
                      id="city"
                      name="city"
                      defaultValue={listing.city}
                      className="w-full p-3 border-2 border-gray-200 rounded-lg text-gray-800 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                    />
                  </div>

                  {/* Address */}
                  <div className="space-y-2">
                    <label htmlFor="address" className="text-sm font-semibold text-gray-700">Address</label>
                    <input
                      id="address"
                      name="address"
                      defaultValue={listing.address}
                      className="w-full p-3 border-2 border-gray-200 rounded-lg text-gray-800 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Price Range */}
                <div className="space-y-2">
                  <label htmlFor="priceRange" className="text-sm font-semibold text-gray-700">Price Range</label>
                  <input
                    id="priceRange"
                    name="priceRange"
                    defaultValue={listing.price_range}
                    className="w-full p-3 border-2 border-gray-200 rounded-lg text-gray-800 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                  />
                </div>

                {/* Event Type */}
                <div className="space-y-2">
                  <label htmlFor="eventType" className="text-sm font-semibold text-gray-700">Event Type</label>
                  <input
                    id="eventType"
                    name="eventType"
                    defaultValue={listing.event_type}
                    className="w-full p-3 border-2 border-gray-200 rounded-lg text-gray-800 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Right column */}
              <div className="space-y-6">
                {/* Serving Style */}
                <div className="space-y-2">
                  <label htmlFor="servingStyle" className="text-sm font-semibold text-gray-700">Serving Style</label>
                  <input
                    id="servingStyle"
                    name="servingStyle"
                    defaultValue={listing.serving_style}
                    className="w-full p-3 border-2 border-gray-200 rounded-lg text-gray-800 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Number of Staff */}
                  <div className="space-y-2">
                    <label htmlFor="numOfStaff" className="text-sm font-semibold text-gray-700">Number of Staff</label>
                    <input
                      id="numOfStaff"
                      name="numOfStaff"
                      type="number"
                      defaultValue={listing.num_of_staff}
                      className="w-full p-3 border-2 border-gray-200 rounded-lg text-gray-800 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                    />
                  </div>

                  {/* Number of Guests */}
                  <div className="space-y-2">
                    <label htmlFor="numOfGuests" className="text-sm font-semibold text-gray-700">Number of Guests</label>
                    <input
                      id="numOfGuests"
                      name="numOfGuests"
                      type="number"
                      defaultValue={listing.num_of_guests}
                      className="w-full p-3 border-2 border-gray-200 rounded-lg text-gray-800 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-semibold text-gray-700">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    defaultValue={listing.description}
                    className="min-h-[120px] resize-none w-full p-3 border-2 border-gray-200 rounded-lg text-gray-800 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Image section */}
            <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-teal-50 rounded-lg border-2 border-green-100">
              <div className="space-y-3">
                <label htmlFor="image" className="text-sm font-semibold text-gray-700">Upload New Image (Optional)</label>
                <div className="flex items-start gap-6">
                  <input
                    type="file"
                    id="image"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="cursor-pointer w-full p-3 border-2 border-gray-200 rounded-lg bg-white"
                  />
                  <div className="w-32 h-32 rounded-lg overflow-hidden border-2 border-green-200 shadow-lg">
                    <img
                      src={imagePreview || listing.image_url || "/placeholder.svg"}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancelEdit}
                className="cursor-pointer px-8 py-3 rounded-md border-2 border-gray-300 text-gray-600 hover:bg-gray-100 transition-all duration-200"
              >
                Cancel
              </button>
              <div className="flex-1"></div>
              <button
                type="submit"
                className="cursor-pointer px-8 py-3 rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )


  // Delete listings view
  const renderDeleteListings = () => (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center mb-6">
        <button
          onClick={handleBackToDashboard}
          className="cursor-pointer flex items-center mr-4 py-2 px-4 rounded-md hover:bg-green-100 text-green-700 hover:text-green-800 transition-all duration-200"
        >
          <FiArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </button>
        <h2 className="text-3xl font-bold text-gray-800">Delete Listings</h2>
      </div>

      <div className="rounded-lg shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 overflow-hidden">
        <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white p-6 rounded-t-lg">
          <h3 className="text-2xl font-bold">Manage Deletions</h3>
          <p className="text-red-100">Select listings to remove</p>
        </div>
        <div className="p-8"> 
          {loading ? (
            <p className="text-gray-600">Loading your listings...</p>
          ) : listings.length === 0 ? (
            <p className="text-gray-600 text-lg">You have no listings yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {listings.map((listing) => (
                <div key={listing.id} className="bg-white rounded-lg p-4 shadow-md border hover:shadow-lg transition duration-200">
                  <h4 className="text-xl font-semibold text-gray-800">{listing.title}</h4>
                  <p className="text-gray-600 mt-1">{listing.description?.slice(0, 80)}...</p>
                  <button
                    onClick={() => handleDeleteListing(listing)}
                    className="mt-4 inline-flex items-center px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition"
                  >
                    <FiEdit className="mr-2" /> Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )

  // Render the appropriate view based on current state
  switch (currentView) {
    case "add":
      return renderAddListing()
    case "edit":
      return renderEditListings()
    case "editForm":
      return renderEditListingForm(selectedListing) //fills form with the selected listing data
    case "delete":
      return renderDeleteListings()
    default:
      return renderDashboard()
  }
}
