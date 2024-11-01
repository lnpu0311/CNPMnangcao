const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  roomTitle: { type: String, required: true },
  roomName: { type: String, required: true },
  dateCreate: { type: Date, required: true, default: Date.now },
  deposit: { type: Number, required: true },
  area: { type: Number, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  images: [{ type: String }],
  is_active: { type: Boolean, required: true, default: false },
  is_available: { type: Boolean, required: true, default: false },
  is_paid: { type: Boolean, required: true, default: false },
  hostelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hostel",
    required: true,
  },
  TenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: false,
    default: null,
  },
});

module.exports = mongoose.model("Room", roomSchema);
