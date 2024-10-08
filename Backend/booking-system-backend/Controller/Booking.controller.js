
import Booking from "../models/Booking.js";


export const CreateBooking = async (req, res) => {
    const { title, start, end, room, userId } = req.body;

    // Validate incoming data
    if (!title || !start || !end || !room || !userId) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    // Check for overlapping bookings
    const existingBooking = await Booking.findOne({
        room,
        $or: [
            { start: { $lt: end, $gt: start } }, // Overlapping start time
            { end: { $lt: end, $gt: start } },   // Overlapping end time
            { start: { $lte: start }, end: { $gte: end } } // Fully overlapping
        ]
    });

    if (existingBooking) {
        return res.status(409).json({ message: 'This room is already booked for the selected time.' });
    }

    try {
        const newBooking = new Booking({ title, start, end, room, userId });
        await newBooking.save();
        return res.status(201).json(newBooking);
    } catch (error) {
        console.error('Error creating booking:', error);
        return res.status(500).json({ message: 'Error creating booking' });
    }
};

export const GetBooking = async (req, res) => {
    try {
        // If userId is provided, fetch bookings for that user
        // If not, fetch all bookings
        const query = req.body.userId ? { userId: req.body.userId } : {};

        const events = await Booking.find(query);
        return res.json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        return res.status(500).json({ message: 'Error fetching events' });
    }
};

export const GetUserEvents = async (req, res) => {
    const userId = req.params.userId;
    console.log('dsjfhdjsfjhdsjfhdsf', userId);

    try {
        const events = await Booking.find({ userId });
        res.status(200).json(events);
    } catch (error) {
        console.error('Error fetching user events:', error);
        res.status(500).json({ message: 'Error fetching events' });
    }
};
export const UpdateBooking = async (req, res) => {
    const bookingId = req.params.id;
    const { title, start, end, room } = req.body;

    // Validate incoming data
    if (!title && !start && !end && !room) {
        return res.status(400).json({ message: 'At least one field (title, start, end, room) must be provided to update.' });
    }

    try {
        // Include room in the update
        const booking = await Booking.findByIdAndUpdate(
            bookingId,
            { title, start, end, room }, // Add room here
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
};

export const DeleteBooking = async (req, res) => {
    const bookingId = req.params.id; // Change this line

    try {
        const booking = await Booking.findByIdAndDelete(bookingId); // Use bookingId here

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found or you do not have permission to delete this booking.' });
        }
        return res.json({ message: 'Booking deleted.' });
    } catch (error) {
        console.error('Error deleting booking:', error);
        return res.status(500).json({ message: 'Error deleting booking' });
    }
};
