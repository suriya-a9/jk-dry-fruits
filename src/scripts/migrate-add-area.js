

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import mongoose from 'mongoose';
import Address from '../models/Address.js';

async function migrate() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ Connected to MongoDB");

        const result = await Address.updateMany(
            { area: { $exists: false } },
            { $set: { area: "Unknown" } }
        );

        console.log(`Updated ${result.modifiedCount} address documents.`);
    } catch (error) {
        console.error("❌ Migration failed:", error);
    } finally {
        await mongoose.disconnect();
    }
}

migrate();