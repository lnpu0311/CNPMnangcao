const RentalRequest = require('../models/rentalRequest.model');
const Booking = require('../models/booking.model');
const Room = require('../models/room.model');
const User = require('../models/user.model');

//Tạo yêu cầu thuê phòng
exports.createRentalRequest = async(req,res) =>{
    try{
        const {bookingId} = req.body;
        const tenantId = req.user.id;
        
        // Kiểm tra booking 
        const booking = await Booking.findById(bookingId)
            .populate('roomId')
            .populate('landlordId');
            
        if(!booking){
            return res.status(404).json({
                success:false,
                message:"Bạn cần xem phòng trước khi yêu cầu thuê"
            });
        }

        // Kiểm tra booking phải được chấp nhận 
        if(booking.status !=='accepted'){
            return res.status(400).json({
                success:false,
                message:"Vui lòng chờ chủ trọ xác nhận lịch xem phòng!"
            });
        }

        // Kiểm tra phòng còn trống
        if(booking.roomId.status !=='available'){
            return res.status(400).json({
                success:false,
                message:"Phòng hiện không còn trống"
            });
        }

        // Kiểm tra yêu cầu thuê trùng 
        const existingRequest = await RentalRequest.findOne({
            roomId: booking.roomId._id,
            tenantId,
            status: 'pending'
        });

        if(existingRequest){
            return res.status(400).json({
                success:false,
                message:"Yêu cầu thuê phòng đang chờ duyệt!"
            });
        }

        // Tạo yêu cầu thuê 
        const rentalRequest = new RentalRequest({
            bookingId,
            tenantId,
            landlordId: booking.landlordId._id,
            roomId: booking.roomId._id,
        });

        await rentalRequest.save();

        res.status(201).json({
            success:true,
            message:"Đã gửi yêu cầu thuê phòng thành công"
        });

    }catch(error){
        console.error('Create rental request error:', error);
        return res.status(500).json({
            success:false,
            message:"Không thể tạo yêu cầu thuê phòng"
        });
    }
};

// Đổi tên function từ updateRentalRequest thành updateRentalRequestStatus
exports.updateRentalRequestStatus = async (req,res) =>{
    try{
        const {id} = req.params;
        const {status, rejectReason} = req.body;
        
        const request = await RentalRequest.findById(id)
            .populate('tenantId', 'name phone');
            
        if(!request){
            return res.status(404).json({
                success:false,
                message:"Không tìm thấy yêu cầu thuê"
            });
        }

        if(status === 'accepted') {
            const room = await Room.findById(request.roomId);
            if(!room) {
                return res.status(404).json({
                    success: false,
                    message: "Không tìm thấy phòng"
                });
            }
            
            if(room.status !== 'available') {
                return res.status(400).json({
                    success: false,
                    message: "Phòng đã được thuê"
                });
            }

            // Chỉ cập nhật status và tenantId
            await Room.findByIdAndUpdate(request.roomId, {
                status: 'occupied',
                tenantId: request.tenantId._id
            });

            // Từ chối và xóa các yêu cầu thuê khác
            const otherRequests = await RentalRequest.find({
                roomId: request.roomId,
                _id: { $ne: request._id }
            });

            // Cập nhật trạng thái rejected cho các yêu cầu khác
            for (const req of otherRequests) {
                req.status = 'rejected';
                req.rejectReason = 'Phòng đã được thuê bởi người khác';
                await req.save();
                // Xóa yêu cầu sau khi cập nhật trạng thái
                await RentalRequest.findByIdAndDelete(req._id);
            }
        }

        // Cập nhật trạng thái yêu cầu hiện tại
        request.status = status;
        if(rejectReason) {
            request.rejectReason = rejectReason;
        }
        await request.save();
        
        // Xóa yêu cầu sau khi xử lý xong
        await RentalRequest.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: `Đã ${status === 'accepted' ? 'chấp nhận' : 'từ chối'} yêu cầu thuê phòng`
        });

    } catch (error) {
        console.error('Update rental request error:', error);
        return res.status(500).json({
            success: false,
            message: "Không thể cập nhật trạng thái: " + error.message
        });
    }
};

// Lấy danh sách yêu cầu thuê cho landlord
exports.getLandlordRentalRequests = async (req, res) => {
  try {
    const landlordId = req.user.id;

    const requests = await RentalRequest.find({ landlordId })
      .populate('bookingId')
      .populate('tenantId', 'name phone email')
      .populate({
        path: 'roomId',
        select: 'roomName roomTitle price area description electricity water images',
        populate: {
          path: 'hostelId',
          select: 'name'
        }
      });

    res.status(200).json({
      success: true,
      data: requests
    });

  } catch (error) {
    console.error('Get landlord rental requests error:', error);
    res.status(500).json({
      success: false,
      message: "Không thể lấy danh sách yêu cầu thuê"
    });
  }
};
