/*This gets rendered to the page.js of the seller-dashboard*/

'use client';

import { useState, useEffect } from 'react';
import { useSession } from "@supabase/auth-helpers-react"
import { FaTrash } from "react-icons/fa";
import { saveWeeklyAvailability, 
        addDateException, 
        getDateExceptions, 
        getWeeklyAvailability ,
        deleteDateException,
      } from "../../lib/services/schedule_crud"

export default function ScheduleSection() {
  const [dateRange, setDateRange] = useState({
    startYear: '',
    startMonth: '',
    startDay: '',
    endYear: '',
    endMonth: '',
    endDay: '',
  });

  const [availability, setAvailability] = useState({
    //default values are set to 'Available'
    Sunday: 'Available',
    Monday: 'Available',
    Tuesday: 'Available',
    Wednesday: 'Available',
    Thursday: 'Available',
    Friday: 'Available',
    Saturday: 'Available'
  });

  const [errors, setErrors] = useState({
    startYear: '', startMonth: '', startDay: '',
    endYear: '', endMonth: '', endDay: '',
    dateLogic: ''
  });


  const [blockType, setBlockType] = useState('Open'); // 'Open' or 'Block' | default to 'Open'
  const [exceptions, setExceptions] = useState([]);

  const session = useSession();

  const handleDateChange = (field, value) => {
    // Allow only numbers and limit length
    const numericValue = value.replace(/[^0-9]/g, '');
    let maxLength;
    let valid = true;

    //Validation for month and day format. If incorrect, state is not updated
    if (field.includes('Year')) {
      maxLength = 2;
    } 
    else if (field.includes('Month')) {
      maxLength = 2;
      if (numericValue.length === 2) {
        const month = parseInt(numericValue, 10);
        if (month < 1 || month > 12) valid = false;
      }
    } 
    else if (field.includes('Day')) {
      maxLength = 2;
      if (numericValue.length === 2) {
        const day = parseInt(numericValue, 10);
        if (day < 1 || day > 31) valid = false;
      }
    }

    //if (!valid) return; //Don't update state if invalid input

    if (!valid) {
      setErrors(prev => ({ ...prev, [field]: 'Invalid format' }));
      return;
    } else {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }


    setDateRange(prev => ({
      ...prev,
      [field]: numericValue.slice(0, maxLength)
    }));
  };

  const handleDeleteException = async (startDate, endDate) => {
  const confirmed = window.confirm("Are you sure you want to delete this date exception?");
  if (!confirmed) return;

  const userId = session?.user?.id || "df64e4c5-5379-430b-b91f-c63f1dde6eec";

  //Call your delete function in schedule_crud
  const { error } = await deleteDateException(userId, startDate, endDate);
    if (error) {
    alert("Failed to delete date exception");
    } 
    else {
    alert("Date exception deleted");
    //Refresh list after deletion:
    const { data: updatedExceptions } = await getDateExceptions(userId);
    if (updatedExceptions) setExceptions(updatedExceptions);
    }
  };


  const handleAvailabilityToggle = (day, status) => {
    setAvailability(prev => ({
      ...prev,
      [day]: status
    }));
  };

  const handleSubmit = async () => {
    console.log('Date Range:', dateRange);
    console.log('Availability:', availability);
    console.log('Block Type:', blockType);
    
    const userId = session?.user?.id || "df64e4c5-5379-430b-b91f-c63f1dde6eec"; //HARDCODED USER ID
    const newErrors = { ...errors };

    // Validate if all fields are filled
    const fields = ['startYear', 'startMonth', 'startDay', 'endYear', 'endMonth', 'endDay'];
      let hasError = false;
      fields.forEach(field => {
        if (!dateRange[field] || dateRange[field].length !== 2) {
          newErrors[field] = 'Required and must be 2 digits';
          hasError = true;
        } else {
          newErrors[field] = '';
        }
      });

    //saves weekly availability to database
    const { error: availErr } = await saveWeeklyAvailability(userId, availability);
    if (availErr) {
      console.error(availErr);
      return alert('Error saving weekly availability');
    }

    //saves date exception to database
    const startDate = `20${dateRange.startYear}-${dateRange.startMonth}-${dateRange.startDay}`;
    const endDate   = `20${dateRange.endYear}-${dateRange.endMonth}-${dateRange.endDay}`;

    //Error handling to make sure startDate < endDate
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      newErrors.dateLogic = 'Start date must be earlier than end date';
      hasError = true;
    } 
    else {
      newErrors.dateLogic = '';
    }
    setErrors(newErrors);
    if (hasError) return;

    const { error: dateErr } = await addDateException(userId, startDate, endDate, blockType);
    if (dateErr) return alert("Error saving date range");

    //re-fetch exceptions after adding new one
    const { data: updatedExceptions, error: fetchErr } = await getDateExceptions(userId);
    if (updatedExceptions) setExceptions(updatedExceptions);

      alert('Schedule updated successfully!');
  };

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dateInputFields = [
    { placeholder: 'YY', name: 'startYear', value: dateRange.startYear },
    { placeholder: 'MM', name: 'startMonth', value: dateRange.startMonth },
    { placeholder: 'DD', name: 'startDay', value: dateRange.startDay },
  ];
  const dateInputFieldsEnd = [
    { placeholder: 'YY', name: 'endYear', value: dateRange.endYear },
    { placeholder: 'MM', name: 'endMonth', value: dateRange.endMonth },
    { placeholder: 'DD', name: 'endDay', value: dateRange.endDay },
  ];

  //Fetch existing schedule data on mount
  useEffect(() => {
  const fetchScheduleData = async () => {
    const userId = session?.user?.id || "df64e4c5-5379-430b-b91f-c63f1dde6eec"; //HARDCODED USER ID
    if (!userId) return;

    //Fetch users weekly availability 
    const { data: availabilityData, error: availErr } = await getWeeklyAvailability(userId);
    if (availabilityData) {
      const mapped = {};
      availabilityData.forEach(row => {
        mapped[row.day] = row.status ? 'Available' : 'Busy';
      });
      setAvailability(mapped);
    }

    //Fetch users date exceptions to be displayed
    const { data: exceptionsData, error: exceptionErr } = await getDateExceptions(userId);
    if (exceptionsData) {
      setExceptions(exceptionsData);
    }
  };

    fetchScheduleData();
  }, [session]);


  return (
    <div className="max-w-3xl mx-auto p-6 md:p-8 bg-gray-100 rounded-lg font-sans"> {/* Main background to light gray */}
      {/* Open & Block specific dates section */}
      <div className="mb-8"> {/* Removed white bg and shadow */}
        <h2 className="text-xl font-bold mb-3 text-gray-800">Open & Block specific dates</h2>
        
      {/* --- Date range inputs ------------------------------------------------ */}
      <div className="flex items-center gap-x-2 mb-3 flex-wrap relative w-full">

        {/* Start Date inputs */}
        {dateInputFields.map(f => (
          <div key={f.name} className="relative flex flex-col items-center">
            <input
              type="text"
              placeholder={f.placeholder}
              value={f.value}
              onChange={e => handleDateChange(f.name, e.target.value)}
              maxLength={2}
              className={`w-16 h-10 px-2 py-2 bg-white border rounded text-center text-sm
                focus:outline-none transition-colors duration-150
                ${errors[f.name]
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'}`}
            />
            {errors[f.name] && (
              <p className="absolute left-1/2 -translate-x-1/2 top-full mt-1 text-red-500 text-xs whitespace-nowrap">
                {errors[f.name]}
              </p>
            )}
          </div>
        ))}

        {/* separator dash */}
        <span className="mx-1 text-gray-600 text-xl font-light self-center">—</span>

        {/* End Date inputs */}
        {dateInputFieldsEnd.map(f => (
          <div key={f.name} className="relative flex flex-col items-center">
            <input
              type="text"
              placeholder={f.placeholder}
              value={f.value}
              onChange={e => handleDateChange(f.name, e.target.value)}
              maxLength={2}
              className={`w-16 h-10 px-2 py-2 bg-white border rounded text-center text-sm
                focus:outline-none transition-colors duration-150
                ${errors[f.name]
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'}`}
            />
            {errors[f.name] && (
              <p className="absolute left-1/2 -translate-x-1/2 top-full mt-1 text-red-500 text-xs whitespace-nowrap">
                {errors[f.name]}
              </p>
            )}
          </div>
        ))}

        {/* Date logic error (startDate > endDate) */}
        {errors.dateLogic && (
          <p className="w-full text-center text-red-500 text-xs mt-2">
            {errors.dateLogic}
          </p>
        )}

        {/* Open & Block Buttons */}
        <button
          onClick={() => setBlockType('Open')}
          className={`ml-auto px-5 py-2 h-10 rounded text-sm font-semibold transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
            blockType === 'Open'
              ? 'bg-blue-500 text-white focus:ring-blue-400'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-300'
          }`}
        >
          Open
        </button>
        <button
          onClick={() => setBlockType('Block')}
          className={`px-5 py-2 h-10 rounded text-sm font-semibold transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
            blockType === 'Block'
              ? 'bg-red-500 text-white focus:ring-red-400'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-300'
          }`}
        >
          Block
        </button>
      </div>

        <p className="text-xs text-gray-500 pt-2">
          Make sure there is no booking during the time you want to block
        </p>
      </div>

      {/* Availability section */}
      <div className="mb-8"> {/* Removed white bg and shadow */}
        <h2 className="text-xl font-bold mb-5 text-gray-800">Availability</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 mb-6">
          {days.map((day) => (
            <div key={day} className="flex items-center justify-between">
              <span className="font-medium text-gray-700 w-28">{day}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleAvailabilityToggle(day, 'Available')}
                  className={`px-5 py-2 w-28 rounded text-sm font-semibold transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                    availability[day] === 'Available'
                      ? 'bg-teal-500 text-white focus:ring-teal-400'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-gray-300'
                  }`}
                >
                  Available
                </button>
                <button
                  onClick={() => handleAvailabilityToggle(day, 'Busy')}
                  className={`px-5 py-2 w-28 rounded text-sm font-semibold transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                    availability[day] === 'Busy'
                      ? 'bg-yellow-500 text-white focus:ring-yellow-400' // Changed this line
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-gray-300'
                  }`}
                >
                  Busy
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Update Button Container */}
      <div className="flex justify-start"> {/* Changed to justify-start */}
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white py-2.5 px-12 rounded text-sm font-semibold hover:bg-blue-600 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
        >
          Update
        </button>
      </div>

      {/* Users existing date exceptions */}
      <div>
        {exceptions.length > 0 && (
        <div className="mt-10">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">Your Date Exceptions</h3>
            <ul className="space-y-2">
              {exceptions.map((ex, index) => (
                <li
                  key={index}
                  className={`border border-gray-300 rounded px-4 py-2 text-sm text-gray-700 flex justify-between items-center ${ex.type === 'Open' ? 'bg-green-300' : 'bg-red-300'}`}
                >
                  <span>
                    <span className="font-medium text-gray-900">{ex.type}</span>{' '}
                    from <span>{ex.start_date}</span> to <span>{ex.end_date}</span>
                  </span>

                  <FaTrash
                    className="h-4 w-4 text-gray-700 hover:text-red-700 cursor-pointer ml-4"
                    onClick={() => handleDeleteException(ex.start_date, ex.end_date)}
                  />
                </li>
              ))}
            </ul>
        </div>
      )}
      </div>
    </div>
  );
}