import mongoose from 'mongoose';

const connectMongo = async () => {
    if (mongoose.connections[0].readyState) return;

    // await mongoose.connect(process.env.MONGODB_URI, {
    //     useNewUrlParser: true,
    //     useUnifiedTopology: true,
    // });
    await mongoose.connect(process.env.MONGODB_URI);

    console.log('MongoDB Connected');
};

export default connectMongo;