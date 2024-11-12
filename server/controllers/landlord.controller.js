const Hostel = require("../models/hostel.model");
const Room = require("../models/room.model");
const Contracts = require("../models/contracts.model");
const RentalRequest = require("../models/rentalRequest.model");
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
const createContract = async(req,res) => {
  const contract = req.body;
  console.log('Contract data received:', contract);
  
  // Kiểm tra các trường bắt buộc
  if(!contract.roomId || !contract.tenantId || !contract.startDate || 
     !contract.endDate || !contract.depositFee || !contract.rentFee || 
     !contract.electricityFee || !contract.waterFee || !contract.serviceFee || 
     !contract.landlordId || !contract.utilities) {
    return res.status(400).json({
      success: false,
      message: "Vui lòng điền đầy đủ thông tin hợp đồng"
    });
  }

  // Kiểm tra giá trị số
  if (contract.electricityFee < 0 || contract.waterFee < 0 || 
      contract.serviceFee < 0 || contract.depositFee < 0 || 
      contract.rentFee < 0) {
    return res.status(400).json({
      success: false,
      message: "Các giá trị không được âm"
    });
  }

  try {
    // Kiểm tra phòng có tồn tại không
    const room = await Room.findById(contract.roomId);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy phòng"
      });
    }

    // Kiểm tra phòng đã có hợp đồng chưa
    const existingContract = await Contracts.findOne({
      roomId: contract.roomId
    });

    if (existingContract) {
      return res.status(400).json({
        success: false,
        message: "Phòng này đã có hợp đồng. Vui lòng kết thúc hợp đồng cũ trước khi tạo hợp đồng mới"
      });
    }

    const newContract = new Contracts({
      roomId: contract.roomId,
      tenantId: contract.tenantId,
      landlordId: contract.landlordId,
      startDate: contract.startDate,
      endDate: contract.endDate,
      depositFee: contract.depositFee,
      rentFee: contract.rentFee,
      electricityFee: contract.electricityFee,
      waterFee: contract.waterFee,
      serviceFee: contract.serviceFee,
      utilities: {
        electricity: {
          unitPrice: contract.utilities.electricity.unitPrice,
          initialReading: 0,
          currentReading: 0,
          lastUpdated: new Date()
        },
        water: {
          unitPrice: contract.utilities.water.unitPrice,
          initialReading: 0,
          currentReading: 0,
          lastUpdated: new Date()
        }
      },
      monthlyFees: []
    });

    await newContract.save();

    // Cập nhật trạng thái phòng
    await Room.findByIdAndUpdate(contract.roomId, {
      status: 'pending_contract',
      tenantId: contract.tenantId
    });

    // Xóa rental request sau khi tạo hợp đồng thành công
    await RentalRequest.findOneAndDelete({
      roomId: contract.roomId,
      tenantId: contract.tenantId,
      status: 'pending'
    });

    res.status(200).json({
      success: true, 
      data: newContract,
      message: "Tạo hợp đồng thành công"
    });
  } catch(error) {
    console.error('Create contract error:', error);
    res.status(500).json({
      success: false, 
      message: "Không thể tạo hợp đồng: " + error.message
    });
  }
};
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
