import { createSupabaseBrowserClient } from "../supabase/client";

const supabase = createSupabaseBrowserClient();

//Create new listing
export const createListing = async (formData: FormData, user_id: string) => {
  const {
    title,
    city,
    address,
    priceRange,
    eventType,
    servingStyle,
    numOfStaff,
    numOfGuests,
    description,
    image_url,
  } = Object.fromEntries(formData)

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
    image_url: image_url || null,
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

//Users upload image
export async function uploadImage(file: File, userId: string) {
  const fileExt = file.name.split(".").pop()
  const filePath = `public/${userId}/${Date.now()}.${fileExt}`

  const { data, error } = await supabase.storage
    .from("listing-images")
    .upload(filePath, file)

  if (error) return { error }

  const { data: publicUrlData } = supabase.storage
    .from("listing-images")
    .getPublicUrl(filePath)

  return { url: publicUrlData?.publicUrl, error: null }
}

