import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    address_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Address', required: true },
    total_amount: Number,
    upi_transaction_id: String,
    payment_status: {
        type: String,
        enum: ['Paid', 'Unpaid'],
        default: 'Unpaid'
    },
    order_status: {
        type: String,
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending'
    }
}, { timestamps: true });

// export default mongoose.models.Order || mongoose.model('Order', orderSchema);

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
export default Order;