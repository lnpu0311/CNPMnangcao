const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const sendverificationCode = require("../middlewares/sendEmail");
const { use } = require("../configs/email.config");
const Hostel = require("../models/hostel.model");
const Room = require("../models/room.model");
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

//Xác thực Email OTP
const verifyOTP = async (req, res) => {
  const { email, verifyOTP } = req.body;
  try {
    const user = await User.findOne({ 
      email: email,
      otpVerification: verifyOTP,
      otpExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: "Mã OTP không chính xác hoặc đã hết hạn" 
      });
    }

    // Cập nhật trạng thái xác thực
    await User.findByIdAndUpdate(user._id, {
      is_verified: true,
      $unset: { otpVerification: "", otpExpires: "" }
    });

    return res.status(200).json({ 
      success: true, 
      message: "Xác thực OTP thành công"
    });
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};
//Thay đổi mật khẩu (sau khi đăng nhập)
const changePassword = async (req,res) => {
  const {currentPassword,newPassword} = req.body;
  try{
    //Tìm user dựa trên id từ token 
    const user = await User.findById(req.user.id);
    if(!user){
      return res.status(400).json({
        success:false,
        message:"Không tìm thấy người dùng "
      });
    }
    //Kiểm tra mật khẩu hiện tại 
    const isMatch = await bcrypt.compare(currentPassword,user.password);
    if(!isMatch){
      return res.status(400).json({
        success:false,
        message: "Mật khẩu hiện tại không đúng "
      });
    }
    //Hash mật khẩu mới 
    const hashPassword = await bcrypt.hash(newPassword,10);

    //Cập nhật mật khẩu mới 
    await User.findByIdAndUpdate(user._id,{
      password :hashPassword
    });
    res.status(200).json({
      success:true,
      message: "Đổi mật khẩu thành công"
    });
  }catch(error){
    res.status(500).json({
      success:false,
      message: error.message
    });
  }
}
const getAllRooms = async (req, res) => {
  try {
    console.log("Fetching all rooms...");
    const rooms = await Room.find()
      .populate({
        path: 'hostelId',
        select: 'name address district city ward'
      });
    
    console.log("Found rooms:", rooms);

    if (!rooms || rooms.length === 0) {
      console.log("No rooms found");
      return res.status(200).json({
        success: true,
        data: []
      });
    }

    res.status(200).json({
      success: true,
      data: rooms
    });
  } catch (error) {
    console.error("Error in getAllRooms:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
//Tìm kiếm 
const searchAccommodation = async(req,res) =>{
  try {
    const {keyword}= req.query;
    //Kiểm tra keyword 
    if(!keyword){
      return res.status(400).json({
        success:false,
        message:"Không có từ khóa tìm kiếm"
      });
    }
    //Tìm kiếm trong hostel 
    const hostels = await Hostel.find({
      $or:[
        {name:{$regex:keyword, $options:'i'}},
        {address:{$regex:keyword,$options:'i'}},
        {district:{$regex:keyword,$options:'i'}},
        {city:{$regex:keyword,$options:'i'}},
      ]
    }).populate({
      path:'rooms',
      select:'roomName roomTitle price area images status'// Khi tìm Hostel, populate rooms để xem các phòng trong nhà trọ đó
    });
    //Tìm kiếm trong room
    const rooms = await Room.find({
      $or:[
        {roomName:{$regex:keyword,$options:'i'}},
        {roomTitle:{$regex:keyword,$options:'i'}}
      ]
    }).populate({
      path:'hostelId',
      select:'name address district city imageUrl' // Khi tìm Room, populate hostelId để biết phòng thuộc nhà trọ nào
    });
    //Kết hợp và lọc kết quả 
    const result = {
      //Lọc hostel có phòng trống
      hostel:hostels
      .filter(hostel => hostel.rooms.some(room => room.status === 'available' ))
      .map(hostel=>({
        id: hostel._id,
        name:hostel.name,
        address:hostel.address,
        district:hostel.district,
        city:hostel.city,
        imageUrl:hostel.imageUrl,
        availableRooms:hostel.rooms.filter(room => room.status === 'available'),
        type:'hostel'
      })),
      //Chỉ lấy phòng còn trống
      rooms:rooms
      .filter(room => room.status === 'available')
      .map(room => ({
        id: room._id,
        roomName: room.roomName,
        roomTitle:room.roomTitle,
        price:room.price,
        area:room.area,
        images:room.images,
        hostel:{
          id:room.hostelId._id,
          name:room.hostelId.name,
          address:room.hostelId.address,
          district:room.hostelId.district,
          city:room.hostelId.city,
        },
        type:'room'
      }))
    };
    res.status(200).json({
      success:true,
      data:result,
      total:{
        hostels:result.hostel.length,
        rooms:result.rooms.length,
        all:result.hostel.length+result.rooms.length
      }
    });
  }catch(error){
    res.status(500).json({
      success:false,
      message:"Lỗi tìm kiếm" + error.message
    });
  }
}
module.exports = {
  getUser,
  getUserByRole,
  updateActive,
  updateUser,
  changePassword,
  verifyOTP,
  searchAccommodation,
  getAllRooms
};
