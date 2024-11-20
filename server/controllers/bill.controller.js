const Bill = require('../models/bill.model');
const User = require('../models/user.model');

exports.getBillHistory = async (req, res) => {
    try {
        // Lấy bills của tenant dựa trên userId từ token
        const bills = await Bill.find({ 
            tenantId: req.user.id 
        })
        .populate({
            path: 'roomId',
            select: 'roomName'
        })
        .sort({ createdAt: -1 });

        // Trả về dữ liệu
        return res.status(200).json({
            success: true,
            data: bills,
            message: 'Lấy lịch sử hóa đơn thành công'
        });

    } catch (error) {
        console.error('Get bill history error:', error);
        return res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy lịch sử hóa đơn'
        });
    }
}; 