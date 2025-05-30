import mongoose from 'mongoose';

const ComboItemSchema = new mongoose.Schema({
    name: String,
    weight: Number,
    weightUnit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'WeightAttribute',
    },
    price: Number,
}, { _id: false });

const VariationSchema = new mongoose.Schema({
    weight: Number,
    weightUnit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'WeightAttribute',
    },
    price: Number,
}, { _id: true });

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, default: '/assets/admin/product-placeholder.webp' },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    price: {
        type: Number,
        required: function () {

            return this.comboItems && this.comboItems.length > 0;
        }
    },
    variations: [VariationSchema],
    comboItems: [ComboItemSchema],
    inStock: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);