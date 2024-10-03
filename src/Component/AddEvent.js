import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddEvent = () => {
    const [title, setTitle] = useState('');
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const [room, setRoom] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        const token = localStorage.getItem('token');
        if (!token) {
            setErrorMessage('You must be logged in to add an event.');
            return;
        }

        try {
            // Log the data being sent
            console.log('Data being sent:', { title, start, end, room });

            const response = await axios.post('http://localhost:5000/api/bookings', { title, start, end, room }, {
                headers: { Authorization: `Bearer ${token}` }
            });


            if (response.status === 201) {
                alert('Event added successfully!');
                setTitle('');
                setStart('');
                setEnd('');
                setRoom('');
            }
            navigate('/calendar')
        } catch (error) {

            const message = error.response?.data?.message || 'Failed to add event. Please try again.';
            setErrorMessage(message);
        }
    };

    return (
        <div className="form-container">
            <h2>Add Event</h2>
            {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Display error message */}
            <form onSubmit={handleSubmit}>
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
                    <option value="Room 3">Room 3</option>
                </select>
                <button type="submit">Add Event</button>
            </form>
        </div>
    );
};

export default AddEvent;
