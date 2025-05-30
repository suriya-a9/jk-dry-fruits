import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import connectDB from '../lib/mongodb.js';
import Product from '../models/Product.js';

async function updateProducts() {
    try {
        await connectDB();

        const result = await Product.updateMany(
            { inStock: { $exists: false } },
            { $set: { inStock: true } }
        );

        console.log(`✅ Updated ${result.modifiedCount} products`);
        process.exit(0);
    } catch (err) {
        console.error('🔥 Error updating products:', err);
        process.exit(1);
    }
}

updateProducts();