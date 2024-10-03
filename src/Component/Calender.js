import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import api from './Api';
import axios from 'axios';


const localizer = momentLocalizer(moment);

const CalendarComponent = () => {
    const [events, setEvents] = useState([]);

    const fetchEvents = async () => {
        const response = await api.get('/bookings');
        const bookings = response.data.map(booking => ({
            id: booking._id,
            title: booking.title,
            start: new Date(booking.start),
            end: new Date(booking.end),
        }));
        setEvents(bookings);
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleSelect = async (event) => {
        const token = localStorage.getItem('token'); // or however you're storing the token

        try {
            const response = await axios.post(
                'http://localhost:6000/api/bookings', // Adjust this URL as needed
                {
                    title: event.title,
                    start: event.start,
                    end: event.end,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Include the token here
                    },
                }
            );

            console.log('Event created:', response.data);
        } catch (error) {
            console.error('Error creating event:', error.response ? error.response.data : error.message);
        }
    };


    return (
        <div>
            <h2>Booking Calendar</h2>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500 }}
                onSelectSlot={handleSelect}
                selectable
            />
        </div>
    );
};

export default CalendarComponent;
