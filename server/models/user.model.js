const verify = require("jsonwebtoken/verify");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  numPhone: { type: String, required: true },
  gender: {
    type: String,
    enum: ["female", "male"],
    required: true,
  },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["tenant", "landlord", "manager", "admin"],
    required: true,
    default: "tenant",
  },
  is_active: { type: Boolean, required: true, default: true },
  otpVerfication: { type: String, required: true },
  is_verified: { type: Boolean, required: true, default: false },
  imageUrl: {
    type: String,
    required: false,
    default:
      "https://asset.cloudinary.com/cnpmnc/17da4fe9a04710f6b649531eef6c33e4",
  },
  landlordId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: false,
  },
});

module.exports = mongoose.model(`User`, userSchema);
