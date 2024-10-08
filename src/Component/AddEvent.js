import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import './AddEvent.css'; // Import CSS file
import Swal from 'sweetalert2';

const roomOptions = [
    { value: 'conference_1', label: '1. Conference 1' },
    { value: 'conference_2', label: '2. Conference 2' },
    { value: 'think_tank', label: '3. Think Tank' },
];

const AddEvent = ({ onClose, refreshEvents, eventToEdit }) => {
    const [title, setTitle] = useState('');
    const [start, setStart] = useState(new Date());
    const [end, setEnd] = useState(new Date(new Date().getTime() + 60 * 60 * 1000)); // Set end time 1 hour after start
    const [room, setRoom] = useState('');

    useEffect(() => {
        if (eventToEdit) {
            setTitle(eventToEdit.title);
            setStart(new Date(eventToEdit.start));
            setEnd(new Date(eventToEdit.end));
            setRoom(eventToEdit.room); // Ensure room is set correctly
        } else {
            setTitle('');
            setStart(new Date());
            setEnd(new Date(new Date().getTime() + 60 * 60 * 1000));
            setRoom('');
        }
    }, [eventToEdit]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            if (eventToEdit) {
                // Update existing event
                await axios.put(`http://localhost:5000/api/bookings/Update/${eventToEdit.id}`, {
                    title,
                    start,
                    end,
                    room,
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                Swal.fire({
                    title: "Success",
                    text: "Update Successfully done!",
                    icon: "success"
                });
            } else {
                // Create new event
                await axios.post('http://localhost:5000/api/bookings/Create', {
                    title,
                    start,
                    end,
                    room,
                    userId: JSON.parse(localStorage.getItem('user')).id
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                Swal.fire({
                    title: "Success",
                    text: "Event Create Successfully done!",
                    icon: "success"
                });
            }
            onClose();
            refreshEvents();
        } catch (error) {
            if (error.response?.status === 409) {
                Swal.fire({
                    title: "Alert",
                    text: "This room is already booked for the selected time",
                    icon: "warning"
                });

            } else {
                console.error('Error saving event:', error);
            }
        }
    };

    const handleDelete = async () => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`http://localhost:5000/api/bookings/Delete/${eventToEdit.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            Swal.fire({
                title: "Success",
                text: "Event Delete Successfully done!",
                icon: "success"
            });
            onClose();
            refreshEvents();
        } catch (error) {
            console.error('Error deleting event:', error);
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>{eventToEdit ? 'Update Event' : 'Add New Event'}</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Event Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                    <label>Start Date:</label>
                    <input
                        type="date"
                        value={moment(start).format('YYYY-MM-DD')}
                        onChange={(e) => {
                            const newStart = new Date(`${e.target.value}T${start.toTimeString().slice(0, 5)}`);
                            setStart(newStart);
                        }}
                        required
                    />
                    <label>Start Time:</label>
                    <input
                        type="time"
                        value={moment(start).format('HH:mm')}
                        onChange={(e) => {
                            const newStart = new Date(`${start.toISOString().split('T')[0]}T${e.target.value}`);
                            setStart(newStart);
                        }}
                        required
                    />
                    <label>End Time:</label>
                    <input
                        type="time"
                        value={moment(end).format('HH:mm')}
                        onChange={(e) => {
                            const newEnd = new Date(`${end.toISOString().split('T')[0]}T${e.target.value}`);
                            setEnd(newEnd);
                        }}
                        required
                    />
                    <label htmlFor="room">Select Room:</label>
                    <select
                        id="room"
                        value={room}
                        onChange={(e) => setRoom(e.target.value)}
                        required
                    >
                        <option value="" disabled>Select a room</option>
                        {roomOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <button type="submit">{eventToEdit ? 'Update Event' : 'Create Event'}</button>
                    <button type="button" onClick={onClose}>Cancel</button>
                    {eventToEdit && (
                        <button type="button" onClick={handleDelete} style={{ backgroundColor: 'red', color: 'white' }}>
                            Delete Event
                        </button>
                    )}
                </form>
            </div>
        </div>
    );
};

export default AddEvent;
