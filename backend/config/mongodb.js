import mongoose from 'mongoose';

const connectDB = async () => {
    mongoose.connection.on('connected', () => {
        console.log('mongodb connected');
    })
    mongoose.connection.on('error', () => {
        console.log('Error while connection to mongoDB');
    })
    
    await mongoose.connect(`${process.env.MONGODB_URI}/e-commerce`);
    
}

export default connectDB;