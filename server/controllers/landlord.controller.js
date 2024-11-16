const Hostel = require("../models/hostel.model");
const Room = require("../models/room.model");
const Contract = require("../models/contracts.model");
const RentalRequest = require("../models/rentalRequest.model");
const UnitRoom = require("../models/unitRoom.model");
const Bill = require("../models/bill.model");

const User = require("../models/user.model");
const createHostel = async (req, res) => {
  const hostel = req.body;
  console.log(req.file);
  if (
    !hostel.name ||
    !hostel.address ||
    !hostel.district ||
    !hostel.city ||
    !hostel.ward
  ) {
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
      message: "Vui lòng điền đầy đủ thông tin",
    });
  }

  const hostel = await Hostel.findById(hostelId);
  if (!hostel) {
    return res.status(400).json({
      success: false,
      message: "Nhà trọ không tồn tại",
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
      status: "available",
      paymentStatus: "unpaid",
    });

    await newRoom.save();
    res.status(200).json({ success: true, data: newRoom });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const createContract = async (req, res) => {
  const contract = req.body;
  console.log("Contract data received:", contract);

  // Kiểm tra các trường bắt buộc
  if (
    !contract.roomId ||
    !contract.tenantId ||
    !contract.startDate ||
    !contract.endDate ||
    !contract.depositFee ||
    !contract.rentFee ||
    !contract.electricityFee ||
    !contract.waterFee ||
    !contract.landlordId
  ) {
    return res.status(400).json({
      success: false,
      message: "Vui lòng điền đầy đủ thông tin hợp đồng",
    });
  }

  // Kiểm tra giá trị số
  if (
    contract.electricityFee < 0 ||
    contract.waterFee < 0 ||
    contract.serviceFee < 0 ||
    contract.depositFee < 0 ||
    contract.rentFee < 0
  ) {
    return res.status(400).json({
      success: false,
      message: "Các giá trị không được âm",
    });
  }

  try {
    // Kiểm tra phòng có tồn tại không
    const room = await Room.findById(contract.roomId);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy phòng",
      });
    }

    // Kiểm tra phòng đã có hợp đồng chưa
    const existingContract = await Contract.findOne({
      roomId: contract.roomId,
    });

    if (existingContract) {
      return res.status(400).json({
        success: false,
        message:
          "Phòng này đã có hợp đồng. Vui lòng kết thúc hợp đồng cũ trước khi tạo hợp đồng mới",
      });
    }

    const newContract = new Contract({
      roomId: contract.roomId,
      tenantId: contract.tenantId,
      landlordId: contract.landlordId,
      startDate: contract.startDate,
      endDate: contract.endDate,
      depositFee: contract.depositFee,
      rentFee: contract.rentFee,
      electricityFee: contract.electricityFee,
      waterFee: contract.waterFee,
    });

    const data = await newContract.save();

    // Cập nhật trạng thái phòng
    await Room.findByIdAndUpdate(contract.roomId, {
      status: "occupied",
      tenantId: contract.tenantId,
      contractId: newContract._id,
    });

    await newContract.save();

    // Cập nhật trạng thái phòng với { new: true } để trả về document đã update
    const updatedRoom = await Room.findByIdAndUpdate(
      contract.roomId,
      {
        $set: {
          status: "occupied",
          tenantId: contract.tenantId,
        },
      },
      { new: true }
    );

    console.log("Updated room:", updatedRoom); // Thêm log để kiểm tra

    if (!updatedRoom) {
      throw new Error("Không thể cập nhật thông tin phòng");
    }

    // Cập nhật rental request
    const updatedRequest = await RentalRequest.findOneAndUpdate(
      {
        roomId: contract.roomId,
        tenantId: contract.tenantId,
        status: "pending",
      },
      {
        status: "accepted",
        contractId: newContract._id,
      },
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy yêu cầu thuê phòng",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        contract: newContract,
        room: updatedRoom,
      },
      message: "Tạo hợp đồng thành công",
    });
  } catch (error) {
    console.error("Create contract error:", error);
    res.status(500).json({
      success: false,
      message: "Không thể tạo hợp đồng: " + error.message,
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
    const hostel = await Hostel.findById(hostelId).populate("rooms");
    if (!hostel) {
      return res
        .status(400)
        .json({ success: false, message: "Hostel not found" });
    }

    res.status(200).json({ success: true, data: hostel });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getRoomById = async (req, res) => {
  const { roomId } = req.params;

  try {
    const room = await Room.findById(roomId)
      .populate("hostelId")
      .populate("tenantId");

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy phòng",
      });
    }

    // Format dữ liệu trả về
    const roomData = {
      _id: room._id,
      roomName: room.roomName,
      roomTitle: room.roomTitle,
      mainImage: room.images[0], // Lấy ảnh đầu tiên làm ảnh chính
      images: room.images,
      area: room.area,
      price: room.price,
      deposit: room.deposit,
      description: room.description,
      status: room.status,
      hostel: room.hostelId
        ? {
            name: room.hostelId.name,
            address: room.hostelId.address,
          }
        : null,
      tenant: room.tenantId
        ? {
            name: room.tenantId.name,
            phone: room.tenantId.phone,
            email: room.tenantId.email,
          }
        : null,
    };

    console.log("Room data:", roomData); // Debug log

    res.status(200).json({
      success: true,
      data: roomData,
    });
  } catch (error) {
    console.error("Error in getRoomById:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server: " + error.message,
    });
  }
};

const getTenantList = async (req, res) => {
  try {
    const landlordId = req.user.id;
    console.log("LandlordId from token:", landlordId);

    const hostels = await Hostel.find({ landlordId });
    console.log("Hostels found:", hostels.length);

    if (hostels.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        message: "Không tìm thấy cơ sở nào",
      });
    }

    const contracts = await Contract.find({
      landlordId: landlordId,
      endDate: { $gte: new Date() },
    })
      .populate({
        path: "tenantId",
        model: "User",
        select: "name email phone",
      })
      .populate({
        path: "roomId",
        model: "Room",
        select: "roomName hostelId",
        populate: {
          path: "hostelId",
          model: "Hostel",
          select: "name",
        },
      });

    console.log("Valid contracts found:", contracts.length);

    // Format dữ liệu trả về
    const tenants = contracts
      .map((contract) => {
        if (!contract.roomId?.hostelId || !contract.tenantId) {
          console.warn("Missing data for contract:", contract._id);
          return null;
        }

        return {
          _id: contract._id,
          name: contract.tenantId.name,
          email: contract.tenantId.email,
          phone: contract.tenantId.phone,
          facility: contract.roomId.hostelId.name,
          room: contract.roomId.roomName,
          startDate: contract.startDate,
          endDate: contract.endDate,
        };
      })
      .filter(Boolean);

    console.log("Final tenants list:", tenants);

    res.status(200).json({
      success: true,
      data: tenants,
    });
  } catch (error) {
    console.error("Error getting tenant list:", error);
    res.status(500).json({
      success: false,
      message: "Không thể lấy danh sách khách thuê: " + error.message,
    });
  }
};
const updateUnit = async (req, res) => {
  const unit = req.body;
  const { roomId } = req.params;
  console.log(roomId);
  if (!unit.elecIndex || !unit.aquaIndex || !unit.month || !unit.year) {
    res
      .status(400)
      .json({ success: false, message: "Vui lòng nhập đầy đủ thông tin" });
  }
  try {
    const room = await Room.findById(roomId);
    if (!room) {
      res.status(400).json({ success: false, message: "Không có phòng này" });
    }
    const oldUnit = await UnitRoom.findOne({
      roomId: roomId,
      month: unit.month,
      year: unit.year,
    });
    console.log(oldUnit);
    if (oldUnit) {
      const data = await UnitRoom.findOneAndUpdate(
        { _id: oldUnit.id },
        {
          elecIndex: unit.elecIndex,
          aquaIndex: unit.aquaIndex,
        }
      );
      return res.status(200).json({ success: true, data: data });
    }
    const newUnit = new UnitRoom({
      elecIndex: unit.elecIndex,
      aquaIndex: unit.aquaIndex,
      month: unit.month,
      year: unit.year,
      roomId: roomId,
    });
    const data = await newUnit.save();
    res.status(200).json({ success: true, data: data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const createBill = async (req, res) => {
  const { roomId, tenantId, rentFee, serviceFee, dueDate } = req.body;
  try {
    // Tìm hai bản ghi UnitRoom gần nhất cho phòng
    const unitRecords = await UnitRoom.find({ roomId: roomId })
      .sort({ year: -1, month: -1 })
      .limit(2);
    if (unitRecords.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Không đủ dữ liệu điện nước để tính toán hóa đơn",
      });
    }
    // Tách dữ liệu điện và nước từ hai bản ghi gần nhất
    const [newRecord, oldRecord] = unitRecords;
    const elecIndexDifference = newRecord.elecIndex - oldRecord.elecIndex;
    const aquaIndexDifference = newRecord.aquaIndex - oldRecord.aquaIndex;
    // Tính chi phí điện
    const calculateElectricityFee = (kWh) => {
      let fee = 0;
      if (kWh <= 50) {
        fee = kWh * 1678;
      } else if (kWh <= 100) {
        fee = 50 * 1678 + (kWh - 50) * 1734;
      } else if (kWh <= 200) {
        fee = 50 * 1678 + 50 * 1734 + (kWh - 100) * 2014;
      } else if (kWh <= 300) {
        fee = 50 * 1678 + 50 * 1734 + 100 * 2014 + (kWh - 200) * 2536;
      } else {
        fee =
          50 * 1678 + 50 * 1734 + 100 * 2014 + 100 * 2536 + (kWh - 300) * 2834;
      }
      return fee;
    };
    // Tính chi phí nước
    const calculateWaterFee = (m3) => {
      let fee = 0;
      if (m3 <= 10) {
        fee = m3 * 5973;
      } else if (m3 <= 20) {
        fee = 10 * 5973 + (m3 - 10) * 7052;
      } else if (m3 <= 30) {
        fee = 10 * 5973 + 10 * 7052 + (m3 - 20) * 8669;
      } else {
        fee = 10 * 5973 + 10 * 7052 + 10 * 8669 + (m3 - 30) * 15929;
      }
      return fee;
    };
    // Tính toán chi phí điện và nước
    const electricityFee = calculateElectricityFee(elecIndexDifference);
    const waterFee = calculateWaterFee(aquaIndexDifference);
    // Tính tổng chi phí
    const totalAmount = rentFee + serviceFee + electricityFee + waterFee;
    // Tạo hóa đơn mới
    const newBill = new Bill({
      roomId,
      tenantId,
      rentFee,
      electricityFee,
      waterFee,
      serviceFee,
      totalAmount,
      dueDate,
    });
    // Lưu hóa đơn vào cơ sở dữ liệu
    const savedBill = await newBill.save();
    res.status(201).json({ success: true, data: savedBill });
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
  createContract,
  getTenantList,
  updateUnit,
};
