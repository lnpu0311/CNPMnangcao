const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const rentController = require('../controllers/rentPayment.controller');

//Route tạo thanh toán  bằng paylpal 
router.post('/create-paypal',authMiddleware(["tenant"]),rentController.createRentPayment);
//Route xử lý callback từ paypal 
router.get('/paypal/success', authMiddleware(["tenant"]), rentController.executeRentPayment);
//Route xử lý callback khi người dùng hủy thanh toán
router.get('/paypal/cancel', (req, res) => {
    res.redirect(`${process.env.CLIENT_URL}/tenant/bills?payment=cancelled`);
});

// Route thanh toán VNPAY
router.post('/vnpay/create', authMiddleware(["tenant"]), rentController.createVNPayPayment);
router.get('/vnpay/callback', rentController.vnpayCallback);

module.exports = router;
