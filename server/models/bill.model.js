const mongoose = require("mongoose");

const billSchema = new mongoose.Schema({
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
    required: true,
  },
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tenant",
    required: true,
  },
  rentFee: { type: Number, required: true },
  electricityFee: { type: Number, required: true },
  waterFee: { type: Number, required: true },
  serviceFee: { type: Number, required: false },
  serviceFeeDescription: { type: String, required: false },
  totalAmount: { type: Number, required: true },
  isPaid: { type: Boolean, default: false },
  paidAt: { type: Date },
  dueDate: { type: Date, required: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Bill", billSchema);
