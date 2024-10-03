import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import api from './Api';

const localizer = momentLocalizer(moment); // Localizer for the calendar

const EventCalendar = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            const token = localStorage.getItem('token');
            const response = await api.get('/bookings', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setEvents(response.data);
        };

        fetchEvents();
    }, []);

    return (
        <Calendar
            localizer={localizer} // Pass the localizer
            events={events.map(event => ({
                ...event,
                start: new Date(event.start),
                end: new Date(event.end),
            }))}
            defaultView="month"
            style={{ height: 500 }}
        />
    );
};

export default EventCalendar;
