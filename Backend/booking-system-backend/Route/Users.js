


// Route/Auth.js
import jwt from 'jsonwebtoken';
import { Login, ProfileDelete, ProfileGet, ProfileUpdate, Signup } from '../Controller/Users.controller.js';

import express from 'express'
const router = express.Router()

const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(400).json({ message: 'Invalid token.' });
        }
        req.user = decoded; // Attach user info to request
        next();
    });
};



// Signup
router.post('/signup', Signup);
// Login
router.post('/login', Login);
// Middleware to authenticate the token
// Get User Profile
router.get('/profile/get', authenticate, ProfileGet);
// Update User Profile
router.put('/profile/update', authenticate, ProfileUpdate);
// Delete User Profile
router.delete('/profile/delete', authenticate, ProfileDelete);

export default router;
