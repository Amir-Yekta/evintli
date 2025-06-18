import { createSupabaseBrowserClient } from "../supabase/client";

const supabase = createSupabaseBrowserClient();

//Adds the weekly availability to the database
export async function saveWeeklyAvailability(
  userId: string,
  availability: Record<string, "Available" | "Busy">
) {
  // build an array of rows to upsert
  const rows = Object.entries(availability).map(([day, status]) => ({
    user_id: userId,
    day,          // Sunday .. Saturday 
    status        // "Available" or "Busy"
  }));

  // upsert all rows in one call
  const { error } = await supabase
  .from('weekly_availability')
  .upsert(rows, { onConflict: 'user_id,day' });

  return { error };
}

//Adds the date exception to the database
export async function addDateException(
  userId: string,
  startDate: string,   // YYYY-MM-DD
  endDate: string,     // YYYY-MM-DD
  type: "Open" | "Block"
) {
  const { error } = await supabase
    .from("date_exceptions")
    .insert({
      user_id:    userId,
      start_date: startDate,
      end_date:   endDate,
      type        // enum: 'Open' | 'Block'
    });

  return { error };
}