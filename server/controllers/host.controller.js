const Host = require("../models/host.model");

//Lấy data của Host, thường dùng tạo danh sách
const getHost = async (req, res) => {
  try {
    const hosts = await Host.find({});
    res.status(200).json({ success: true, data: hosts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
//Lấy data của Host theo id chỉ định, dùng để định hướng từ phòng này đến Host đang thuê
const getHostById = async (req, res) => {
  const { id } = req.params;
  try {
    const host = await Host.findById(id);
    if (!hosts) {
      return res
        .status(404)
        .json({ success: false, message: "Host not found" });
    }
    res.status(200).json({ success: true, data: host });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
//Tạo Host, dùng để là chức năng đăng ký
const createHost = async (req, res) => {
  const host = req.body;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (
    !host.name ||
    !host.email ||
    !host.numPhone ||
    !host.password ||
    !host.address
  ) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all fields" });
  }
  if (host.numPhone.length !== 10) {
    return res
      .status(400)
      .json({ success: false, message: "Phone number must be 10 characters" });
  }

  if (!emailRegex.test(host.email)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid email format" });
  }
  const findEmail = await Host.findOne({ email: host.email });

  if (findEmail) {
    return res
      .status(400)
      .json({ success: false, message: "Email is available" });
  }

  const newHost = new Host(host);
  try {
    await newHost.save();
    res.status(200).json({ success: true, data: newHost });
  } catch (error) {
    console.error("Error in register", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = { getHost, createHost, getHostById };
