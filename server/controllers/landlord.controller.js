const Hostel = require("../models/hostel.model");
const Room = require("../models/room.model");
const Contracts = require("../models/contracts.model");
const createHostel = async (req, res) => {
  const hostel = req.body;
  console.log(req.file);
  if (!hostel.name || !hostel.address || !hostel.district || !hostel.city || !hostel.ward) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all fields" });
  }
  if (hostel.elecUnit < 0 || hostel.aqua < 0) {
    return res.status(400).json({
      success: false,
      message: "elecUnit,aquaUnit must not be less than 0",
    });
  }

  let imageUrl =
    "https://asset.cloudinary.com/cnpmnc/17da4fe9a04710f6b649531eef6c33e4"; // Ảnh mặc định
  if (req.file) {
    imageUrl = req.file.path; // Lấy URL của ảnh sau khi upload lên Cloudinary
  }
  const newHostel = new Hostel({
    name: hostel.name,
    address: hostel.address,
    district: hostel.district,
    city: hostel.city,
    ward: hostel.ward,
    imageUrl: imageUrl,
    landlordId: hostel.landlordId,
  });
  try {
    await newHostel.save();
    res.status(200).json({ success: true, data: newHostel });
  } catch (error) {
    console.error("Error in register", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

const createRoom = async (req, res) => {
  const { roomTitle, roomName, deposit, area, description, price } = req.body;
  const { hostelId } = req.params;
  
  if (!roomTitle || !roomName || !deposit || !area || !description || !price) {
    return res.status(400).json({ 
      success: false, 
      message: "Vui lòng điền đầy đủ thông tin" 
    });
  }

  const hostel = await Hostel.findById(hostelId);
  if (!hostel) {
    return res.status(400).json({ 
      success: false, 
      message: "Nhà trọ không tồn tại" 
    });
  }

  const imagePaths = req.files.map((file) => file.path);

  try {
    const newRoom = new Room({
      roomTitle,
      roomName,
      deposit,
      area,
      description,
      price,
      images: imagePaths,
      hostelId: hostel._id,
      status: 'available',
      paymentStatus: 'unpaid'
    });
    
    await newRoom.save();
    res.status(200).json({ success: true, data: newRoom });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const createContract = async(req,res) =>{
  const contract = req.body;
  console.log(req.file);
  if(!contract.roomId||!contract.tenantId||!contract.starDate||!contract.endDate||!contract.depositFee||!contract.rentFee||!contract.electricityFee||!contract.waterFee||!contract.serviceFee||!contract.landlordId){
    return res.status(400).json({success:false,message:"Please create all fields"});
  }
  if (contract.electricityFee < 0 || contract.waterFee < 0||contract.serviceFee<0) {
    return res.status(400).json({
      success: false,
      message: "electricityFee,waterFee,serviceFee must not be less than 0",
    });
  }
  const newContract = new Contracts({
    roomId:contract.roomId,
    startDate:contract.startDate,
    endDate:contract.endDate,
    depositFee:contract.depositFee,
    rentFee:contract.rentFee,
    electricityFee:contract.electricityFee,
    waterFee:contract.waterFee,
    serviceFee:contract.serviceFee,
    tenantId:contract.tenantId,
    landlordId:contract.landlordId,
  });
  try{
    await newContract.save();
    res.status(200).json({success:true,data:newContract});
  }catch(error){
    res.status(500).json({success:false,message:error.message});
  }

}
const getHostelByLandLordId = async (req, res) => {
  const { landlordId } = req.query;
  console.log(landlordId);

  try {
    const hostel = await Hostel.find({ landlordId: landlordId });

    if (!hostel) {
      return res
        .status(404)
        .json({ success: false, message: "Hostel not found" });
    }
    res.status(200).json({ success: true, data: hostel });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getHostelById = async (req, res) => {
  const { hostelId } = req.params;
  try {
    // Find the hostel by ID and populate it with related rooms
    const hostel = await Hostel.findById(hostelId).populate("rooms"); // Adjust "rooms" to your actual field name
    if (!hostel) {
      return res
        .status(400)
        .json({ success: false, message: "Hostel not found" });
    }

    // Assuming `hostel.rooms` is an array of room documents, send just the rooms in `data`
    res.status(200).json({ success: true, data: hostel });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getRoomById = async (req, res) => {
  const { id } = req.params;

  try {
    const room = await Room.findById(id);
    if (!room) {
      return res
        .status(400)
        .json({ success: false, message: "Room not found" });
    }
    res.status(200).json({ success: true, data: room });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getHostelByLandLordId,
  createHostel,
  getHostelById,
  getRoomById,
  createRoom,
  createContract
};
