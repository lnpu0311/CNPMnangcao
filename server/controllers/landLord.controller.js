const LandLord = require("../models/landLord.model");
const jwt = require("jsonwebtoken");

//Lấy data của Host, thường dùng tạo danh sách
const getLandLord = async (req, res) => {
  try {
    const landLords = await LandLord.find({});
    res.status(200).json({ success: true, data: landLords });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
//Lấy data của Host theo id chỉ định, dùng để định hướng từ phòng này đến Host đang thuê
const getLandLordById = async (req, res) => {
  const { id } = req.params;
  try {
    const landLord = await LandLord.findById(id);
    if (!landLord) {
      return res
        .status(404)
        .json({ success: false, message: "LandLord not found" });
    }
    res.status(200).json({ success: true, data: landLord });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
//Tạo Host, dùng để là chức năng đăng ký
const createLandLord = async (req, res) => {
  const landLord = req.body;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (
    !landLord.name ||
    !landLord.email ||
    !landLord.numPhone ||
    !landLord.password ||
    !landLord.address
  ) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all fields" });
  }
  if (landLord.numPhone.length !== 10) {
    return res
      .status(400)
      .json({ success: false, message: "Phone number must be 10 characters" });
  }

  if (!emailRegex.test(landLord.email)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid email format" });
  }
  const findEmail = await LandLord.findOne({ email: landLord.email });

  if (findEmail) {
    return res
      .status(400)
      .json({ success: false, message: "Email is available" });
  }

  const newLandLord = new LandLord(landLord);
  try {
    await newLandLord.save();
    res.status(200).json({ success: true, data: newLandLord });
  } catch (error) {
    console.error("Error in register", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const loginLandLord = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide both email and password",
    });
  }

  try {
    const landLord = await LandLord.findOne({ email });

    if (!landLord) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: landLord._id, name: landLord.name, model: "landLord" },
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
module.exports = {
  getLandLord,
  createLandLord,
  getLandLordById,
  loginLandLord,
};
