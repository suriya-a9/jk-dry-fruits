import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import mongoose from 'mongoose';
import Product from '../models/Product.js';
import connectDB from '../lib/mongodb.js';


async function migrate() {
    try {

        await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("MongoDB Connected");


        const products = await Product.find({ 'variations._id': { $exists: false } });


        for (let product of products) {

            for (let variation of product.variations) {
                if (!variation._id) {
                    variation._id = new mongoose.Types.ObjectId();
                }
            }


            await product.save();
            console.log(`Updated product with variations: ${product.name}`);
        }

        console.log("🚀 Migration complete.");
    } catch (error) {
        console.error("Migration failed:", error);
    } finally {
        mongoose.connection.close();
    }
}

migrate();