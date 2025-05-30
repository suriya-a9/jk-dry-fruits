import mongoose from 'mongoose';

const weightAttributeSchema = new mongoose.Schema({
    label: {
        type: String,
        required: true,
        unique: true
    }
});

export default mongoose.models.WeightAttribute || mongoose.model('WeightAttribute', weightAttributeSchema);