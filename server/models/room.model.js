const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  roomName: { type: String, required: true },
  dateCreate: { type: Date, required: true, default: Date.now },
  deposit: { type: Number, required: true },
  areacreage: { type: Number, required: true },
  elecIndex: { type: Number, required: true, default: 0 },
  aquaIndex: { type: Number, required: true, default: 0 },
  description: { type: String, required: true },
  hostelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hostel",
    required: true,
  },
});

module.exports = mongoose.model("Room", roomSchema);
