"use client"

import { useState } from "react"
import { FiPlus, FiEdit, FiTrash2, FiArrowLeft } from "react-icons/fi"
import { createListing } from "../lib/services/listing_crud"
import { useSession } from "@supabase/auth-helpers-react"


export default function ListingSection() {
  const [currentView, setCurrentView] = useState("dashboard") // 'dashboard', 'add', 'edit', 'delete'
  const [imagePreview, setImagePreview] = useState(null)

  const session = useSession()

  //Handle for creating a form submission to create a new listing
  const handleCreateListing = async (e) => {
    e.preventDefault()

    if (!session?.user?.id) {
      alert("User not logged in.")
      return
    }

    const formData = new FormData(e.target)
    //Add image upload handling here if you're uploading to Supabase Storage separately

    const { data, error } = await createListing(formData, session?.user?.id)

    if (error) {
      console.error("Error creating listing:", error)
      alert("There was an error creating the listing.")
    } else {
      alert("Listing created successfully!")
      handleBackToDashboard()
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleBackToDashboard = () => {
    setCurrentView("dashboard")
    setImagePreview(null)
  }

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
                      id="image"
                      name="image"
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
          <p className="text-gray-600 text-lg">This section will display your existing listings for editing.</p>
          {/* You can add your existing listings here */}
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
          <p className="text-gray-600 text-lg">This section will display your existing listings for deletion.</p>
          {/* You can add your existing listings here */}
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
    case "delete":
      return renderDeleteListings()
    default:
      return renderDashboard()
  }
}
