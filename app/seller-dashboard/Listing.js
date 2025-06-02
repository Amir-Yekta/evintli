/*This gets rendered to the page.js of the seller-dashboard*/


export default function ListingSection() {
    return(
        <div>
            <h1 className="text-black text-6xl ml-6 m-6">Listing</h1>

            {/*Form submission for the listing*/}
            <div className=" ml-10">
                <form className="">
                    <h2>Add a Listing</h2>
                    <label htmlFor="title">Title</label>
                    <input 
                     id="title"
                     name="title"
                     placeholder="Title"/>

                    <label htmlFor="city">City</label>
                    <input 
                     id="city"
                     name="city"
                     placeholder="City"/>

                    <label htmlFor="address">Address</label>
                    <input 
                     id="address"
                     name="address"
                     placeholder="Address"/>

                    <label htmlFor="priceRange">Price Range</label>
                    <input 
                     id="priceRange"
                     name="priceRange"
                     placeholder="Price Range"/>

                    <label htmlFor="eventType">Event Type</label>
                    <input 
                     id="eventType"
                     name="eventType"
                     placeholder="Event Type"/>

                    <label htmlFor="servingStyle">Serving Style</label>
                    <input 
                     id="servingStyle"
                     name="servingStyle"
                     placeholder="Serving Style"/>

                    <label htmlFor="numOfStaff">Number of Staff</label>
                    <input 
                     id="numOfStaff"
                     name="numOfStaff"
                     placeholder="Num Of Staff"/>

                    <label htmlFor="numOfGuests">Number of Guests</label>
                    <input 
                     id="numOfGuests"
                     name="numOfGuests"
                     placeholder="Number Of Guests"/>
                     
                    <label htmlFor="image">Upload an Image</label>
                    <input
                    type="file" 
                     id="image"
                     name="image"/>
                </form>
            </div>
        </div>
    );
}