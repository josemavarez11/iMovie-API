import mongoose from 'mongoose';
import message from '../json/messages.json';

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
        console.log(message.success.MongoConnection.description);
    } catch (error) {
        console.log(message.error.MongoConnection, error);
    }
};

export default mongoConnection;