import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
}, { timestamps: true });

// export const User = mongoose.models.User || mongoose.model('User', userSchema);
const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;