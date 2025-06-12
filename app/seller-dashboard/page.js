'use client';

import React, {useState} from 'react';
import ListingSection from './Listing';
import ScheduleSection from './schedule/schedule';
import CalendarSection from './calendar/calendar';
import SupportSection from './support/support';
import LogoutSection from './logout';

export default function SellerDashboardPage(){

    const [activeSection, setActiveSection] = useState('Listing');

    const renderContent = ()=> {
        switch(activeSection) {
            case 'Listing':
                return <ListingSection/>
            case 'Schedule':
                return <ScheduleSection/>
            case 'Calendar':
                return <CalendarSection/>
            case 'Support':
                return <SupportSection/>
            case 'Logout':
                return <LogoutSection/>
            default:
                return <ListingSection/>
        }
    }

    return(
        <div className="flex min-h-screen">
            {/*This is the Sidebar */}
            <div className="w-64 bg-gradient-to-br from-green-900 to-teal-900 p-4 shadow-xl">
                {/*This is the just a placeholder to put the seller ID and Name */}
                <h2 className="text-lg font-bold mb-6 text-white">Seller</h2>
                <ul className="space-y-2">
                    <li className={`px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 ease-in-out hover:bg-white/10 hover:translate-x-1 text-white/90 hover:text-white ${
                        activeSection === "Schedule" ? "bg-white/20 text-white" : ""}`}onClick={() => setActiveSection("Schedule")}>Schedule
                    </li>
                    <li className={`px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 ease-in-out hover:bg-white/10 hover:translate-x-1 text-white/90 hover:text-white ${
                        activeSection === "Calendar" ? "bg-white/20 text-white" : ""}`}onClick={() => setActiveSection("Calendar")}>Calendar
                    </li>
                    <li className={`px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 ease-in-out hover:bg-white/10 hover:translate-x-1 text-white/90 hover:text-white ${
                        activeSection === "Listing" ? "bg-white/20 text-white" : ""}`}onClick={() => setActiveSection("Listing")}>Listing
                    </li>
                    <li className={`px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 ease-in-out hover:bg-white/10 hover:translate-x-1 text-white/90 hover:text-white ${
                        activeSection === "Support" ? "bg-white/20 text-white" : ""}`}
                        onClick={() => setActiveSection("Support")}>Support
                    </li>
                    <li className="px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 ease-in-out hover:bg-red-500/20 hover:translate-x-1 text-white/90 hover:text-red-200 mt-8"
                        onClick={() => setActiveSection("Logout")}>
                        Logout
                    </li>
                </ul>
            </div>

            {/*Main content - idk what should be inside */}
            <div className="flex-1 p-4 bg-white">
                {renderContent()}
            </div>
        </div>
    );
};