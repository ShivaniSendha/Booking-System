import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import axios from 'axios';
import 'react-big-calendar/lib/css/react-big-calendar.css'; // Import CSS
import './calendar.css'; // Import custom styles
import { useNavigate } from 'react-router-dom';
import AddEvent from './AddEvent'; // Import AddEvent component

const localizer = momentLocalizer(moment);

const CalendarComponent = () => {
    const [events, setEvents] = useState([]);
    const [user, setUser] = useState({});
    const [editingProfile, setEditingProfile] = useState(false);
    const [newUsername, setNewUsername] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [menuOpen, setMenuOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false); // Modal state for AddEvent
    const [loading, setLoading] = useState(false); // Loading state
    const navigate = useNavigate();

    // const fetchEvents = async () => {
    //     setLoading(true); // Set loading to true
    //     const token = localStorage.getItem('token');
    //     try {
    //         const response = await axios.get('http://localhost:5000/api/bookings/Get', {
    //             headers: { Authorization: `Bearer ${token}` }
    //         });
    //         const bookings = response.data.map(booking => ({
    //             id: booking._id,
    //             title: booking.title,
    //             start: new Date(booking.start),
    //             end: new Date(booking.end),
    //         }));
    //         setEvents(bookings);
    //     } catch (error) {
    //         console.error('Error fetching events:', error);
    //         setErrorMessage('Failed to fetch events.'); // Error message
    //     } finally {
    //         setLoading(false); // Reset loading state
    //     }
    // };

    const fetchUserProfile = () => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setUser(storedUser);
            setNewUsername(storedUser.username);
        }
    };

    useEffect(() => {
    
        fetchUserProfile();
    }, []);

    const handleProfileUpdate = async () => {
        const token = localStorage.getItem('token');
        try {
            await axios.put('http://localhost:5000/api/auth/profile/update', { username: newUsername }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser({ ...user, username: newUsername });
            setEditingProfile(false);
        } catch (error) {
            console.error('Error updating profile:', error);
            setErrorMessage('Failed to update profile.');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className="calendar-container">
            <div className="header">
                <h2>Calendar</h2>
                <div className="user-profile">
                    <div className="avatar" onClick={() => setMenuOpen(!menuOpen)}>
                        {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <button className="create-event-button" onClick={() => setModalOpen(true)}>
                        + Create Event
                    </button>
                    {menuOpen && (
                        <div className="dropdown-menu">
                            <h3>User Profile: {user.username}</h3>
                            {editingProfile ? (
                                <div>
                                    <input
                                        type="text"
                                        value={newUsername}
                                        onChange={(e) => setNewUsername(e.target.value)}
                                    />
                                    <button onClick={handleProfileUpdate}>Update</button>
                                    <button onClick={() => setEditingProfile(false)}>Cancel</button>
                                </div>
                            ) : (
                                <button onClick={() => setEditingProfile(true)}>Edit Profile</button>
                            )}
                            <button onClick={handleLogout}>Logout</button>
                            {errorMessage && <p className="error-message">{errorMessage}</p>}
                        </div>
                    )}
                </div>
            </div>

            {modalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setModalOpen(false)}>&times;</span>
                        <AddEvent onClose={() => setModalOpen(false)}  />
                    </div>
                </div>
            )}

            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '80vh', width: '100%' }} // Responsive height and width
                selectable
            />
        </div>
    );
};

export default CalendarComponent;
