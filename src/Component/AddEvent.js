// src/components/AddEvent.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import toast CSS

const AddEvent = ({ onClose, refreshEvents }) => {
    const [title, setTitle] = useState('');
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const [room, setRoom] = useState(''); // Add room state
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage(''); // Reset error message

        const token = localStorage.getItem('token');
        try {
            // Make the POST request to create an event
            const response = await axios.post('http://localhost:5000/api/bookings/Create', {
                title,
                start,
                end,
                room, // Include room in the request
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Show success toast
            toast.success('Event added successfully!');

            // Optionally log the response
            console.log('====================================');
            console.log("Response:", response);
            console.log('====================================');

        

    
            onClose(); 
            navigate('/calendar'); 
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setErrorMessage(error.response.data.message); // Display specific error message from the server
            } else {
                setErrorMessage('Failed to create event.'); // Default error message
            }
        }
    };

    return (
        <div>
            <h2>Add Event</h2>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <form className="add-event-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Event Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <input
                    type="datetime-local"
                    placeholder="Start Time"
                    value={start}
                    onChange={(e) => setStart(e.target.value)}
                    required
                />
                <input
                    type="datetime-local"
                    placeholder="End Time"
                    value={end}
                    onChange={(e) => setEnd(e.target.value)}
                    required
                />
                <select value={room} onChange={(e) => setRoom(e.target.value)} required>
                    <option value="">Select Room</option>
                    <option value="Room 1">Room 1</option>
                    <option value="Room 2">Room 2</option>
                    {/* Add more room options as needed */}
                </select>
                <button type="submit">Add Event</button>
            </form>
        </div>
    );
};

export default AddEvent;
