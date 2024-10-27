const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const sendverificationCode = require("../middlewares/sendEmail");
const { use } = require("../configs/email.config");
//Lấy toàn bộ User
const getUser = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(200).json({ success: false, message: error.message });
  }
};
//Lấy user theo role
const getUserByRole = async (req, res) => {
  console.log("hello");
  try {
    // Convert role from string to number
    const role = Number(req.params.role);
    console.log(role);
    // Find users by role
    const users = await User.find({ role: role });

    // Check if users exist with the given role
    if (users.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Không có user có role này" });
    }
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//Cập nhật thông tin User
const updateUser = async (req, res) => {
  const newInfo = req.body;
  try {
    // Xử lý ảnh upload nếu có
    if (req.file) {
      newInfo.imageUrl = req.file.path; // Cập nhật URL ảnh mới sau khi upload
    }

    const user = await User.findByIdAndUpdate(newInfo.userID, newInfo);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//Kích hoạt hoặc khóa tài khoản user
const updateActive = async (req, res) => {
  const { userID, is_active } = req.body;
  try {
    const user = await User.findByIdAndUpdate(userID, { is_active: is_active });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Tài khoản không tồn tại",
      });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      res
        .status(400)
        .json({ success: false, message: "Không tìm thấy tài khoản" });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const upadateUser = await User.findByIdAndUpdate(user.id, {
      password: hashPassword,
      is_verified: false,
      otpVerification: verificationCode,
      otpExpires: otpExpires,
    });
    sendverificationCode(email, verificationCode);
    res.status(200).json({ success: true, data: upadateUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
module.exports = {
  getUser,
  getUserByRole,
  updateActive,
  updateUser,
};
