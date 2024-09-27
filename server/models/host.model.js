const mongoose = require("mongoose");
const hostSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  numPhone: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: Number, required: true, default: 0 },
  is_admin: { type: Number, required: true, default: 0 },
  is_varified: { type: Number, default: 0 },
});

module.exports = mongoose.model(`Host`, hostSchema);
