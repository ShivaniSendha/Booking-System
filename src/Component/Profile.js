// src/components/Profile.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Profile = () => {
    const [user, setUser] = useState({});
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const fetchUserProfile = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get('http://localhost:5000/api/auth/profile', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(response.data);
            setUsername(response.data.username);
        } catch (error) {
            console.error('Error fetching profile:', error);
            setErrorMessage('Failed to load profile.');
        }
    };

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const handleUpdateProfile = async () => {
        const token = localStorage.getItem('token');
        try {
            await axios.put('http://localhost:5000/api/auth/profile', { username, password }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Profile updated successfully');
        } catch (error) {
            console.error('Error updating profile:', error);
            setErrorMessage('Failed to update profile.');
        }
    };

    const handleDeleteProfile = async () => {
        const token = localStorage.getItem('token');
        if (window.confirm('Are you sure you want to delete your profile?')) {
            try {
                await axios.delete('http://localhost:5000/api/auth/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert('Profile deleted successfully');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                // Redirect to login or home page
            } catch (error) {
                console.error('Error deleting profile:', error);
                setErrorMessage('Failed to delete profile.');
            }
        }
    };

    return (
        <div>
            <h2>User Profile</h2>
            {errorMessage && <p>{errorMessage}</p>}
            <div>
                <label>Username:</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <div>
                <label>Password:</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <button onClick={handleUpdateProfile}>Update Profile</button>
            <button onClick={handleDeleteProfile}>Delete Profile</button>
        </div>
    );
};

export default Profile;
