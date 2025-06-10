import { createSupabaseBrowserClient } from "../supabase/client";

const supabase = createSupabaseBrowserClient();

//Create new listing
export const createListing = async (formData: FormData, user_id: string) => {
  const { title, city, address, priceRange, eventType, servingStyle, numOfStaff, numOfGuests, description, image_url } = Object.fromEntries(formData)

  const { data, error } = await supabase.from("listing").insert([{
    user_id,
    title,
    city,
    address,
    price_range: priceRange,
    event_type: eventType,
    serving_style: servingStyle,
    num_of_staff: Number(numOfStaff),
    num_of_guests: Number(numOfGuests),
    description,
    image_url,
  }])

  return { data, error }
}

//Fetch all users listings
export const getUserListings = async (user_id: string) => {
  const { data, error } = await supabase
    .from("listing")
    .select("*")
    .eq("user_id", user_id)
    .order("created_at", { ascending: false })

  return { data, error }
}

//Update listing
export const updateListing = async (id: string, updates: any) => {
  const { data, error } = await supabase
    .from("listing")
    .update(updates)
    .eq("id", id)

  return { data, error }
}

//Delete listing
export const deleteListing = async (id: string) => {
  const { data, error } = await supabase
    .from("listing")
    .delete()
    .eq("id", id)

  return { data, error }
}
