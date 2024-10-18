import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
    try {
        // Connect to the database
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);

        // create indexes
        const db = mongoose.connection.db;
        const gradesCollection = db.collection('grades');

        // Ensure indexes are created
        await gradesCollection.createIndex({ class_id: 1 });
        await gradesCollection.createIndex({ learner_id: 1 });
        await gradesCollection.createIndex({ learner_id: 1, class_id: 1 });

        console.log('Indexes created successfully');
    } catch (error) {
        console.error(`MongoDB connection failed: ${error.message}`);
        process.exit(1); // Exit the process if there is a failure
    }
};

export default connectDB;