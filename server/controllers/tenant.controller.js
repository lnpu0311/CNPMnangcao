const Tenant = require("../models/tenant.model");
const jwt = require("jsonwebtoken");
//Lấy data của Tenant, thường dùng tạo danh sách
const getTenant = async (req, res) => {
  try {
    const tenants = await Tenant.find({});
    res.status(200).json({ success: true, data: tenants });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
//Lấy data của Tenant theo id chỉ định, dùng để định hướng từ phòng này đến tenant đang thuê
const getTenantById = async (req, res) => {
  const { id } = req.params;
  try {
    const tenant = await Tenant.findById(id);
    if (!tenant) {
      return res
        .status(404)
        .json({ success: false, message: "Tenant not found" });
    }
    res.status(200).json({ success: true, data: tenant });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
//Tạo Tenant, dùng để là chức năng đăng ký
const createTenant = async (req, res) => {
  const tenant = req.body;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!tenant.name || !tenant.email || !tenant.numPhone || !tenant.password) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all fields" });
  }
  if (tenant.numPhone.length !== 10) {
    return res
      .status(400)
      .json({ success: false, message: "Phone number must be 10 characters" });
  }

  if (!emailRegex.test(tenant.email)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid email format" });
  }
  const findEmail = await Tenant.findOne({ email: tenant.email });

  if (findEmail) {
    return res
      .status(400)
      .json({ success: false, message: "Email is available" });
  }

  const newTenant = new Tenant(tenant);
  try {
    await newTenant.save();
    res.status(200).json({ success: true, data: newTenant });
  } catch (error) {
    console.error("Error in register", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Đăng nhập Tenant
const loginTenant = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide both email and password",
    });
  }

  try {
    const tenant = await Tenant.findOne({ email });

    if (!tenant) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: tenant._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      success: true,
      token,
      message: "Login successful",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getTenant, createTenant, getTenantById, loginTenant };
