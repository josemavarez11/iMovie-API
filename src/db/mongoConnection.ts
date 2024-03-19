import mongoose from 'mongoose';

/**
 * Connects to MongoDB using the provided MONGODB_URI from the environment variables.
 * @async
 * @function connectDB
 * @returns {Promise<void>} - A promise that resolves when the connection is successful or rejects with an error.
 */
const mongoConnection = async (): Promise<void> => {
    try {
        const mongodbUri = process.env.MONGODB_URI || ''; // Set a default value if MONGODB_URI is undefined
        await mongoose.connect(mongodbUri);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.log('Error connecting to MongoDB:', error);
    }
};

export default mongoConnection;