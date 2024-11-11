const express = require('express');
const router = express.Router();
const Message = require('../models/message.model');
const authMiddleware = require("../middlewares/authMiddleware");

// Lấy lịch sử chat
router.get('/history/:userId', authMiddleware(['tenant', 'landlord']), async (req, res) => {
  try {
    const recipientId = req.params.userId;
    const currentUserId = req.user.id;

    if (!recipientId || typeof recipientId !== 'string') {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid recipient ID' 
      });
    }

    console.log('Fetching messages between:', currentUserId, 'and', recipientId);

    const messages = await Message.find({
      $or: [
        { senderId: currentUserId, recipientId: recipientId },
        { senderId: recipientId, recipientId: currentUserId }
      ],
      deletedFor: { $ne: currentUserId }
    })
    .sort({ timestamp: 1 })
    .limit(50);
    
    res.json({ success: true, data: messages });
  } catch (error) {
    console.error('Error in message history:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Đánh dấu tin nhắn đã đọc
router.put('/read/:senderId', authMiddleware(['tenant', 'landlord']), async (req, res) => {
  try {
    await Message.updateMany(
      { 
        senderId: req.params.senderId, 
        recipientId: req.user.id,
        read: false 
      },
      { read: true }
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Lấy danh sách tin nhắn chưa đọc
router.get('/unread', authMiddleware(['landlord']), async (req, res) => {
  try {
    const landlordId = req.user.id;
    
    const unreadMessages = await Message.find({
      recipientId: landlordId,
      read: false
    })
    .populate('senderId', 'name')
    .sort({ timestamp: -1 });

    // Nhóm tin nhắn theo người gửi
    const groupedMessages = unreadMessages.reduce((acc, message) => {
      const senderId = message.senderId._id.toString();
      if (!acc[senderId]) {
        acc[senderId] = {
          ...message.toObject(),
          count: 1
        };
      } else {
        acc[senderId].count += 1;
      }
      return acc;
    }, {});

    res.json({ 
      success: true, 
      data: Object.values(groupedMessages)
    });
  } catch (error) {
    console.error('Error getting unread messages:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Xóa cuộc trò chuyện (chỉ ẩn với người xóa)
router.delete('/delete-conversation', authMiddleware(['tenant', 'landlord']), async (req, res) => {
  try {
    const { recipientId } = req.body;
    const currentUserId = req.user.id;

    if (!recipientId) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin người nhận'
      });
    }

    // Thêm trường deletedFor để đánh dấu tin nhắn đã bị xóa bởi ai
    const result = await Message.updateMany(
      {
        $or: [
          { senderId: currentUserId, recipientId: recipientId },
          { senderId: recipientId, recipientId: currentUserId }
        ]
      },
      {
        $addToSet: { deletedFor: currentUserId }
      }
    );

    console.log('Marked messages as deleted for user:', result);

    return res.status(200).json({
      success: true,
      message: 'Đã xóa tin nhắn thành công',
      data: {
        modifiedCount: result.modifiedCount
      }
    });

  } catch (error) {
    console.error('Error deleting conversation:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server khi xóa tin nhắn',
      error: error.message
    });
  }
});

module.exports = router; 