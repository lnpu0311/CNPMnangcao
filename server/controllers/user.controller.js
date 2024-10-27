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
//Đăng ký, tạo user
const createUser = async (req, res) => {
  const user = req.body;
  let email = user.email.toLowerCase();
  if (
    !user.email ||
    !user.name ||
    !user.numPhone ||
    !user.gender ||
    !user.password
  ) {
    return res
      .status(400)
      .json({ success: false, message: "Vui lòng điền đủ thông tin" });
  }
  if (user.numPhone.length !== 10) {
    return res
      .status(400)
      .json({ success: false, message: "Số điện thoại phải có 10 chữ số" });
  }

  const isAvailable = await User.findOne({ email: email });

  if (isAvailable && isAvailable.is_verified) {
    return res
      .status(400)
      .json({ success: false, message: "Tài khoản đã tồn tại" });
  }

  if (isAvailable && !isAvailable.is_verified) {
    await User.findOneAndDelete({ email: isAvailable.email });
  }

  const hashPassword = await bcrypt.hash(user.password, 10);
  const verificationCode = Math.floor(
    100000 + Math.random() * 900000
  ).toString();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
  // Xử lý ảnh upload
  let imageUrl =
    "https://asset.cloudinary.com/cnpmnc/17da4fe9a04710f6b649531eef6c33e4"; // Ảnh mặc định
  if (req.file) {
    imageUrl = req.file.path; // Lấy URL của ảnh sau khi upload lên Cloudinary
  }

  const newUser = new User({
    email: email,
    name: user.name,
    numPhone: user.numPhone,
    role: user.role,
    password: hashPassword,
    otpVerification: verificationCode,
    otpExpires: otpExpires,
    is_active: true,
    gender: user.gender,
    imageUrl: imageUrl,
    landlordId: user.landlordId,
  });
  try {
    await newUser.save();
    sendverificationCode(user.email, verificationCode);
    res.status(200).json({ success: true, data: newUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//Đăng nhập
const loginUser = async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;
  let emailLowCase = email.toLowerCase();
  console.log(emailLowCase);
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide both email and password",
    });
  }

  try {
    const user = await User.findOne({ email: emailLowCase });

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
  const { email, verifyOTP } = req.body;

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Tài khoản không tồn tại" });
    }

    if (user.otpVerification !== verifyOTP) {
      return res
        .status(404)
        .json({ success: false, message: "Mã OTP không chính xác" });
    }
    const updateUser = await User.findByIdAndUpdate(
      user.id,
      {
        is_verified: true,
        $unset: { otpVerification: "", otpExpires: "" }, // Xóa cả mã OTP và thời gian hết hạn
      },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "Xác thực thành công",
      data: updateUser,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
//Gửi lại OTP
const resendOtp = async (req, res) => {
  const { email } = req.body;
  console.log(`data gửi về:`, req.body);
  console.log(email);
  const verificationCode = Math.floor(
    100000 + Math.random() * 900000
  ).toString();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Tài khoản không tồn tại" });
    }

    await User.findByIdAndUpdate(user.id, {
      otpVerification: verificationCode,
      otpExpires: otpExpires,
    });
  } catch (error) {}
  sendverificationCode(email, verificationCode);
};
//Quên mật khẩu
const forgotPasword = async (req, res) => {
  const { email, password } = req.body;

  const verificationCode = Math.floor(
    100000 + Math.random() * 900000
  ).toString();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

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
  createUser,
  loginUser,
  updateActive,
  verifyOTP,
  updateUser,
  resendOtp,
  forgotPasword,
};
