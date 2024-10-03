import React, { useState } from 'react';
import axios from 'axios';

const Auth = ({ setToken }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        const response = await axios.post('http://localhost:6000/api/auth/login', { username, password });
        setToken(response.data.token);
    };

    const handleRegister = async () => {
        await axios.post('http://localhost:6000/api/auth/register', { username, password });
    };

    return (
        <div>
            <h2>Login</h2>
            <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
            <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" />
            <button onClick={handleLogin}>Login</button>
            <button onClick={handleRegister}>Register</button>
        </div>
    );
};

export default Auth;
