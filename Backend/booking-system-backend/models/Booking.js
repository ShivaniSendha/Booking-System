// models/Booking.js
import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    title: { type: String, required: true },
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    room: { type: String, required: true }, // Add room selection
});

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
