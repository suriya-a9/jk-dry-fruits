

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' }); 

import mongoose from 'mongoose';
import Order from '../models/Order.js'; 

async function updateOrders() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log("✅ MongoDB connected");

        const result = await Order.updateMany(
            {
                $or: [
                    { payment_status: { $exists: false } },
                    { order_status: { $exists: false } }
                ]
            },
            {
                $set: {
                    payment_status: 'Unpaid',
                    order_status: 'Pending'
                }
            }
        );

        console.log(`✅ Updated ${result.modifiedCount} orders`);
    } catch (err) {
        console.error('❌ Failed to update orders:', err);
    } finally {
        await mongoose.connection.close(); 
    }
}

updateOrders();
