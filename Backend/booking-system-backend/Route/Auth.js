// Route/Auth.js
import express from 'express';

import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();


// Signup
// Route/Auth.js
router.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = new User({ username, password });
        await user.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(400).json({ message: 'Error creating user' });
    }
});


// Login
// Login


router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
});


export default router;
