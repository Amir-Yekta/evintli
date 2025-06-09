// app/dashboard/page.js
'use client';
import { useEffect, useState } from 'react';
// Corrected import: import the function to create the client
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  // Initialize the client by calling the imported function
  const supabase = createSupabaseBrowserClient();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserAndProfile = async () => {
      // Ensure supabase client is valid before using
      if (!supabase) {
        console.error("Supabase client not initialized");
        router.push('/login?error=client_init_failed');
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        // Fetch profile
        const { data: userProfile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        if (error) {
          console.error('Error fetching profile:', error);
          // Optionally, redirect or show an error if profile is crucial
          // For now, we'll allow the page to render with a console error
          // router.push('/login?error=profile_fetch_failed');
        } else {
          setProfile(userProfile);
        }
      } else {
        router.push('/login');
      }
    };
    fetchUserAndProfile();
  }, [router, supabase]); // Added supabase to the dependency array

  const handleLogout = async () => {
    if (!supabase) return; // Guard clause
    await supabase.auth.signOut();
    router.push('/'); // Redirect to home or login page
  };

  if (!user) { // Simpler loading state, profile might be fetched slightly after user
    return <div className="min-h-screen flex items-center justify-center">Loading user data...</div>;
  }

  // Profile might still be loading or might have failed to load
  // The UI handles profile.name and profile.company_name being potentially null/undefined

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        {/* Fallback to user.email if profile or profile.name is not available */}
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Welcome to your Dashboard, {profile?.name || user.email}!</h1>
        <p className="text-gray-600 mb-2">User ID: {user.id}</p>
        <p className="text-gray-600 mb-2">Email: {user.email}</p>
        {/* Conditionally render role if profile and profile.role exist */}
        {profile?.role && <p className="text-gray-600 mb-2">Role: {profile.role}</p>}
        {/* Conditionally render company_name if profile and profile.company_name exist */}
        {profile?.company_name && <p className="text-gray-600 mb-2">Company: {profile.company_name}</p>}
        {profile?.avatar_url && (
            <img src={profile.avatar_url} alt="User avatar" className="w-20 h-20 rounded-full mx-auto my-4" />
        )}
        <button
          onClick={handleLogout}
          className="mt-6 w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Logout
        </button>
        {/* Add links to profile setup, listing upload etc here later */}
        {/* You might want to add a link here to a page where users can update their profile name if desired */}
      </div>
    </div>
  );
}