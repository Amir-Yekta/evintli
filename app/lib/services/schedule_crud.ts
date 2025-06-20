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
    status: status === "Available" //BOOLEAN: 'Available' = true | 'Busy' = false
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
  .upsert({
    user_id: userId || "df64e4c5-5379-430b-b91f-c63f1dde6eec",  //HARDCODED FOR TESTING
    start_date: startDate,
    end_date: endDate,
    type,
  }, 

  { onConflict: 'user_id, start_date, end_date' });

  return { error };
}


//Get weekly availability for a user
export async function getWeeklyAvailability(userId: string) {
  const { data, error } = await supabase
    .from('weekly_availability')
    .select('day, status')
    .eq('user_id', userId);

  return { data, error };
}

//Get date exceptions for a user
export async function getDateExceptions(userId: string) {
  const { data, error } = await supabase
    .from('date_exceptions')
    .select('start_date, end_date, type')
    .eq('user_id', userId)
    .order('start_date', { ascending: false }); // optional: newest first

  return { data, error };
}

//deletes users date exception
export async function deleteDateException(userId: string, startDate: string, endDate: string) {
  const { error } = await supabase
    .from("date_exceptions")
    .delete()
    .match({ user_id: userId, start_date: startDate, end_date: endDate });
  return { error };
}
