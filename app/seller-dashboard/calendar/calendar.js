'use client'; // Required for react-big-calendar as it uses client-side features

import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css'; // Import the styles

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// Sample events data
const myEventsList = [
  {
    title: 'Sample Event',
    start: new Date(2025, 5, 10, 10, 0, 0), // year, month (0-indexed), day, hour, minute, second
    end: new Date(2025, 5, 10, 12, 0, 0),
    allDay: false, // Optional
    resource: 'any', // Optional
  },
  // Add more events here
];

export default function CalendarSection() {
  return (
    <div style={{ height: '500px' }}> {/* You need to give the calendar a height */}
      {/* <p className="font-black">This is A calendar</p> */}
      <Calendar
        localizer={localizer}
        events={myEventsList}
        startAccessor="start"
        endAccessor="end"
        style={{ margin: '20px' }}
      />
    </div>
  );
}