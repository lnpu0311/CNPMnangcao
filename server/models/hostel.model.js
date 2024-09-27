const mongoose = require("mongoose");
const hostelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  district: { type: String, required: true },
  city: { type: String, required: true },
  elecUnit: { type: Number, required: true, default: 1 },
  aquaUnit: { type: Number, required: true, default: 1 },
  servicesFee: { type: Number, required: true, default: 0 },
  hostelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Host",
    require: true,
  },
});

module.exports = mongoose.model(`Hostel`, hostelSchema);
