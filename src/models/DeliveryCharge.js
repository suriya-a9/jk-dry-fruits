// models/DeliveryCharge.js
import mongoose from "mongoose";

const DeliveryChargeSchema = new mongoose.Schema({
    max: { type: Number, required: true },
    charge: { type: Number, required: true },
}, { timestamps: true });

export default mongoose.models.DeliveryCharge || mongoose.model("DeliveryCharge", DeliveryChargeSchema);