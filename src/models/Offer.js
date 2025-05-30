import mongoose from 'mongoose';

const offerSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['delivery_charge', 'order_percentage'],
        required: true,
    },
    percentage: {
        type: Number,
        required: function () {
            return this.type === 'order_percentage';
        },
    },
    isActive: {
        type: Boolean,
        default: false,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    }
}, { timestamps: true });

export default mongoose.models.Offer || mongoose.model('Offer', offerSchema);