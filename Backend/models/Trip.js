import mongoose from "mongoose";

const tripSchema = new mongoose.Schema({
  type: { type: String, required: true },
  destination: { type: String, required: true },
  days: { type: Number, required: true },
  notes: { type: [String] },
  packedItems: { type: Object },
  customItems: { type: Object },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

export default mongoose.model("Trip", tripSchema);