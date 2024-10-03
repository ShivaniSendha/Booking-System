import express from 'express';
import authMiddleware from '../Middleware/midleware.js'
import Booking from '../models/Booking.js';

const router = express.Router();

// Use the authentication middleware for all routes in this router
// router.use(authenticate);

// Create a new booking
router.post('/Create', authMiddleware, async (req, res) => {
    console.log('Received data:', req.body);

    const { title, start, end, room } = req.body;

    // Validate incoming data
    if (!title || !start || !end || !room) {
        return res.status(400).json({ message: 'Title, start, end, and room are required.' });
    }

    try {
        const booking = await Booking.create({ title, start, end, userId: req.user.id, room });
        console.log("booking",booking);
        
        await booking.save();
        return res.status(201).json(booking);
    } catch (error) {
        console.error('Error creating booking:', error);
        return res.status(500).json({ message: 'Error creating booking' });
    }
});


// Get all bookings for the authenticated user
router.get('/Get', async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.user.id });
        return res.json(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        return res.status(500).json({ message: 'Error fetching bookings' });
    }
});

// Update a booking
router.put('/Update:id', async (req, res) => {
    const { title, start, end } = req.body;

    // Validate incoming data
    if (!title && !start && !end) {
        return res.status(400).json({ message: 'At least one field (title, start, end) must be provided to update.' });
    }

    try {
        // Find the booking and ensure the user owns it
        const booking = await Booking.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id }, // Ensure the user is the owner
            { title, start, end },
            { new: true }
        );

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found or you do not have permission to update this booking.' });
        }
        return res.json(booking);
    } catch (error) {
        console.error('Error updating booking:', error);
        return res.status(500).json({ message: 'Error updating booking' });
    }
});

// Delete a booking
router.delete('/Delete:id', async (req, res) => {
    try {
        // Ensure the booking belongs to the authenticated user
        const booking = await Booking.findOneAndDelete({ _id: req.params.id, userId: req.user.id });

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found or you do not have permission to delete this booking.' });
        }
        return res.json({ message: 'Booking deleted.' });
    } catch (error) {
        console.error('Error deleting booking:', error);
        return res.status(500).json({ message: 'Error deleting booking' });
    }
});

export default router;
