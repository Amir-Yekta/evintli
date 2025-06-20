import { createSupabaseBrowserClient } from "../supabase/client";

const supabase = createSupabaseBrowserClient();

//Adds the weekly availability to the database
export async function saveWeeklyAvailability(
  userId: string,
  availability: Record<string, "Available" | "Busy">
) {
  // build an array of rows to upsert
  const rows = Object.entries(availability).map(([day, status]) => ({
    user_id: userId || "df64e4c5-5379-430b-b91f-c63f1dde6eec",  //HARDCODED FOR TESTING
    day,          // Sunday .. Saturday
    status: status === "Available" //BOOLEAN : 'Available' = true | 'Busy' = false
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
  startDate: string,   // YY-MM-DD
  endDate: string,     // YY-MM-DD
  type: "Open" | "Block"
) {
  const { error } = await supabase
    .from("date_exceptions")
    .insert({
      user_id:    userId || "df64e4c5-5379-430b-b91f-c63f1dde6eec", //HARDCODED FOR TESTING
      start_date: startDate,
      end_date:   endDate,
      type: type === "Open" //BOOLEAN: 'Open' = true | 'Block' = false
    });

  return { error };
}