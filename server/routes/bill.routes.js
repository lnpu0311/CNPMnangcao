const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const Bill = require('../models/bill.model');

// Lấy danh sách hóa đơn của tenant 
router.get('/', authMiddleware(['tenant']), async(req, res) => {
  try {
    // Lấy bills theo tenantId từ token
    const bills = await Bill.find({ 
      tenantId: req.user.id 
    })
    .populate({
      path: 'roomId',
      select: 'roomName'
    })
    .sort({ createdAt: -1 });
    
    if (!bills || bills.length === 0) {
      return res.status(200).json({ 
        success: true, 
        data: [],
        message: 'Chưa có hóa đơn nào' 
      });
    }

    res.json({ success: true, data: bills });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Lấy chi tiết một hóa đơn của tenant
router.get('/:id', authMiddleware(['tenant']), async(req, res) => {
  try {
    // Tìm bill theo id và tenantId
    const bill = await Bill.findOne({
      _id: req.params.id,
      tenantId: req.user.id  // Đảm bảo chỉ lấy hóa đơn của tenant hiện tại
    }).populate({
      path: 'roomId',
      select: 'roomName'
    });
      
    if (!bill) {
      return res.status(404).json({ 
        success: false, 
        message: 'Không tìm thấy hóa đơn hoặc không có quyền truy cập' 
      });
    }
    
    res.json({ success: true, data: bill });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;