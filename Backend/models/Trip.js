const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  tripType: String,
  destination: String,
  days: Number,
  notes: String,
  checklist: Object  // Store generated checklist here
  
}, { timestamps: true });

module.exports = mongoose.model("Trip", tripSchema);
