import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, default: 1 },
    variation: { type: mongoose.Schema.Types.ObjectId, ref: 'WeightAttribute', required: false },
    comboItems: [{
        weightUnit: { type: mongoose.Schema.Types.ObjectId, ref: 'WeightAttribute' },
        weight: Number,
        price: Number
    }]
}, { timestamps: true });

export default mongoose.models.CartItem || mongoose.model('CartItem', cartItemSchema);