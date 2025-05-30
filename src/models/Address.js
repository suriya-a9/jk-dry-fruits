import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    full_name: String,
    door_no: String,
    address_line: String,
    area: String,
    city: String,
    state: String,
    pincode: String,
    country: String,
}, { timestamps: true });

// export default mongoose.models.Address || mongoose.model('Address', addressSchema);

const Address = mongoose.models.Address || mongoose.model('Address', addressSchema);
export default Address;