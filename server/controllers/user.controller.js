const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const sendVerficationCode = require("../middlewares/sendEmail");
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
//Đăng ký, tạo user
const createUser = async (req, res) => {
  const user = req.body;
  // user: {
  //   email,name,numphone,gender,role,password
  // }
  if (
    !user.email ||
    !user.name ||
    !user.numPhone ||
    !user.gender ||
    !user.password
  ) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all fields" });
  }
  if (user.numPhone.length !== 10) {
    return res
      .status(400)
      .json({ success: false, message: "Phone number must be 10 characters" });
  }

  const isAvailable = await User.findOne({ email: user.email });

  if (isAvailable) {
    return res
      .status(400)
      .json({ success: false, message: "Email đã tồn tại" });
  }
  const hashPassword = await bcrypt.hash(user.password, 10);
  const verficationCode = Math.floor(
    100000 + Math.random() * 900000
  ).toString();

  // Xử lý ảnh upload
  let imageUrl =
    "https://asset.cloudinary.com/cnpmnc/17da4fe9a04710f6b649531eef6c33e4"; // Ảnh mặc định
  if (req.file) {
    imageUrl = req.file.path; // Lấy URL của ảnh sau khi upload lên Cloudinary
  }

  const newUser = new User({
    email: user.email,
    name: user.name,
    numPhone: user.numPhone,
    role: user.role,
    password: hashPassword,
    otpVerfication: verficationCode,
    is_active: true,
    imageUrl: imageUrl,
  });
  try {
    await newUser.save();
    sendVerficationCode(user.email, verficationCode);
    res.status(200).json({ success: true, data: newUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
//Đăng nhập
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide both email and password",
    });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Tài khoản không tồn tại" });
    }
    if (user.is_verified === false) {
      return res
        .status(404)
        .json({ success: false, message: "Email chưa được xác thực" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(404).json({
        success: false,
        message: "tài khoản hoặc mặt khẩu không chính xác",
      });
    }
    if (user.is_active === false) {
      return res
        .status(404)
        .json({ success: false, message: "Tài khoản chưa được kích hoạt" });
    }
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({
      success: true,
      token,
      message: "Login successful",
    });
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
//Xác thực Email OTP
const verifyOTP = async (req, res) => {
  const { userID, verifyOTP } = req.body;
  try {
    const user = await User.findById(userID);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Tài khoản không tồn tại" });
    }

    if (user.otpVerfication !== verifyOTP) {
      return res
        .status(404)
        .json({ success: false, message: "Mã OTP không chính xác" });
    }
    const updateUser = await User.findByIdAndUpdate(userID, {
      is_verified: true,
    });
    res.status(200).json({
      success: true,
      message: "Xác thực thành công",
      data: updateUser,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getUser,
  getUserByRole,
  createUser,
  loginUser,
  updateActive,
  verifyOTP,
  updateUser,
};
