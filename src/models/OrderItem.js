import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
    order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    variation: { type: mongoose.Schema.Types.ObjectId, ref: 'Product.variations', default: null },
    comboItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product.comboItems' }]
});

// export default mongoose.models.OrderItem || mongoose.model('OrderItem', orderItemSchema);

const OrderItem = mongoose.models.OrderItem || mongoose.model('OrderItem', orderItemSchema);
export default OrderItem;