// db/connection.js
import mongoose from 'mongoose'; // Import Mongoose for MongoDB interaction
import dotenv from 'dotenv'; // Import dotenv to manage environment variables

dotenv.config(); // Load environment variables from .env file

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/booking-system', {
            useNewUrlParser: true, // Use the new URL parser
            useUnifiedTopology: true, // Use the new connection management engine
        });
        console.log('MongoDB connected successfully'); // Log success message
    } catch (err) {
        console.error('MongoDB connection error:', err); // Log any errors
        process.exit(1); // Exit the process if the connection fails
    }
};

export default connectDB; // Export the connectDB function
