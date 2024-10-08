// src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './login.css'; // Import the shared CSS
import Swal from 'sweetalert2';


const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', { username, password });
            const { token, user } = response.data;

            // Check for successful response
            if (response.status === 200 || response.status === 201) {
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));

                Swal.fire({
                    title: "Success",
                    text: "Login successfully done!",
                    icon: "success"
                });

                navigate('/calendar');
            } else {
                // Handle unexpected status
                Swal.fire({
                    title: "Alert",
                    text: "Login failed!",
                    icon: "warning"
                });
            }

            console.log('response', response);

        } catch (error) {
            const message = error.response?.data?.message || 'Failed to login. Please try again.';
            setErrorMessage(message);

            Swal.fire({
                title: "Error",
                text: message,
                icon: "error"
            });
        }
    };


    return (
        <div className="form-container">
            <h2>Login</h2>
            {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Display error message */}
            <form className="form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
