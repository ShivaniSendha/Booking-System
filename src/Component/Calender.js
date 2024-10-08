import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import axios from 'axios';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './calendar.css';
import AddEvent from './AddEvent';

const localizer = momentLocalizer(moment);
const CalendarComponent = () => {
    const [events, setEvents] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [eventToEdit, setEventToEdit] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);

    const fetchEvents = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get('http://localhost:5000/api/bookings/Get', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEvents(response.data.map(booking => ({
                id: booking._id,
                title: booking.title,
                start: new Date(booking.start),
                end: new Date(booking.end),
                room: booking.room // Add room property here
            })));
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };


    useEffect(() => {
        fetchEvents();
    }, []);

    const handleEventClick = (event) => {
        setEventToEdit(event);
        setModalOpen(true);
    };

    const handleDateSelect = (date) => {
        setSelectedDate(date);
        setEventToEdit(null); 
        setModalOpen(true); 
    };

    return (
        <div className="calendar-container">
            <h2>Calendar</h2>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '80vh', width: '100%' }}
                selectable
                onSelectEvent={handleEventClick}
                onSelectSlot={handleDateSelect}
            />

            {modalOpen && (
                <AddEvent
                    onClose={() => setModalOpen(false)}
                    refreshEvents={fetchEvents}
                    eventToEdit={eventToEdit} 
                    selectedDate={selectedDate} 
                />
            )}
        </div>
    );
};

export default CalendarComponent;
