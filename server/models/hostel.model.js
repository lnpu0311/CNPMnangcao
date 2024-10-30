const mongoose = require("mongoose");
const hostelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  district: { type: String, required: true },
  city: { type: String, required: true },
  elecUnit: { type: Number, required: true, default: 1 },
  aquaUnit: { type: Number, required: true, default: 1 },
  servicesFee: { type: Number, required: true, default: 0 },
  landlordId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true,
  },
  imageUrl: { type: String, required: false },
});

module.exports = mongoose.model(`Hostel`, hostelSchema);
