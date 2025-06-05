/*This gets rendered to the page.js of the seller-dashboard*/
'use client';

import { useState } from "react";


export default function ListingSection() {

    const [imagePreview, setImagePreview] = useState(null)

        const handleImageChange = (e) => {
        const file = e.target.files?.[0]
            if (file) {
                const reader = new FileReader()
                reader.onloadend = () => {
                    setImagePreview(reader.result)
                }
                reader.readAsDataURL(file)
            }}
    return (
      <div className="max-w-8xl mx-auto p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-black">Create New Listing</h2>

        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left column */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium text-black">
                  Title
                </label>
                <input id="title" name="title" placeholder="Enter event title" className="w-full text-black" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="city" className="text-sm font-medium text-black">
                    City
                  </label>
                  <input id="city" name="city" placeholder="Enter city" />
                </div>

                <div className="space-y-2">
                  <label htmlFor="address" className="text-sm font-medium text-black">
                    Address
                  </label>
                  <input id="address" name="address" placeholder="Enter address" />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="priceRange" className="text-sm font-medium text-black">
                  Price Range
                </label>
                <input id="priceRange" name="priceRange" placeholder="e.g. $1000-$2000" />
              </div>

              <div className="space-y-2">
                <label htmlFor="eventType" className="text-sm font-medium text-black">
                  Event Type
                </label>
                <input id="eventType" name="eventType" placeholder="e.g. Wedding, Corporate, Birthday" />
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="servingStyle" className="text-sm font-medium text-black">
                  Serving Style
                </label>
                <input id="servingStyle" name="servingStyle" placeholder="e.g. Buffet, Plated, Family Style" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="numOfStaff" className="text-sm font-medium text-black">
                    Number of Staff
                  </label>
                  <input id="numOfStaff" name="numOfStaff" type="number" placeholder="Enter number" />
                </div>

                <div className="space-y-2">
                  <label htmlFor="numOfGuests" className="text-sm font-medium text-black">
                    Number of Guests
                  </label>
                  <input id="numOfGuests" name="numOfGuests" type="number" placeholder="Enter number" />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium text-black">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Describe your event details"
                  className="min-h-[100px] resize-none"
                />
              </div>
            </div>
          </div>

          {/* Image upload section - positioned above where terms would go */}
          <div className="mt-6">
            <div className="space-y-2">
              <label htmlFor="image" className="text-sm font-medium text-black">
                Upload an Image
              </label>
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <input
                    type="file"
                    id="image"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="cursor-pointer"
                  />
                </div>
                {imagePreview && (
                  <div className="w-24 h-24 rounded-md overflow-hidden border">
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

          {/* Form actions with space for terms and conditions */}
          <div className="flex justify-between items-center pt-4">
            <button variant="outline" type="Button">
              Cancel
            </button>
            <div className="flex-1">{/* Space reserved for terms and conditions that will be added by user */}</div>
            <button type="submit">Create Listing</button>
          </div>
        </form>
      </div>
  )
}
