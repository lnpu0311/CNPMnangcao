const {paypalClient} = require("../configs/paypal");
const checkoutNodeJssdk = require("@paypal/checkout-server-sdk");
const Bill = require('../models/bill.model');
const {vnpayConfig,createPaymentUrl, verifyReturnUrl} = require('../configs/vnpay');

// Hàm tạo thanh toán tiền thuê
exports.createRentPayment = async (req, res) => {
    const { rentFee, electricityFee, waterFee, serviceFee, billId } = req.body;
    
    // Tính tổng tiền (VND)
    const totalAmount = rentFee + electricityFee + waterFee + (serviceFee || 0);
    
    // Chuyển đổi VND sang USD (tạm tính 1 USD = 24,000 VND)
    const amountUSD = (totalAmount / 24000).toFixed(2);

    const request = new checkoutNodeJssdk.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
        intent: "CAPTURE",
        purchase_units: [{
            amount: {
                currency_code: "USD",
                value: amountUSD
            },
            description: `Thanh toán hóa đơn #${billId}`
        }],
        application_context: {
            return_url: `${process.env.REACT_APP_API_URL}/payment/paypal/success?billId=${billId}`,
            cancel_url: `${process.env.CLIENT_URL}/tenant/bills?payment=cancelled`,
            brand_name: "Hostel Community",
            landing_page: "LOGIN",
            user_action: "PAY_NOW"
        }
    });

    try {
        const response = await paypalClient.execute(request);
        res.json({
            success: true,
            links: response.result.links
        });
    } catch (error) {
        console.error('PayPal create payment error:', error);
        res.status(500).json({
            success: false,
            message: "Không thể tạo thanh toán PayPal"
        });
    }
};
exports.executeRentPayment = async (req, res) => {
    const { token, billId } = req.query;
    
    try {
        console.log("Processing payment for token:", token, "billId:", billId);
        
        if (!token || !billId) {
            return res.status(400).json({
                success: false,
                message: "Thiếu thông tin thanh toán"
            });
        }

        // Kiểm tra bill tồn tại
        const bill = await Bill.findById(billId);
        if (!bill) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy hóa đơn"
            });
        }

        // Kiểm tra trạng thái bill
        if (bill.status === 'PAID') {
            return res.status(400).json({
                success: false,
                message: "Hóa đơn đã được thanh toán"
            });
        }

        const request = new checkoutNodeJssdk.orders.OrdersCaptureRequest(token);
        request.requestBody({});

        const capture = await paypalClient.execute(request);
        console.log("PayPal capture result:", capture.result);

        if (capture.result.status === "COMPLETED") {
            const updatedBill = await Bill.findByIdAndUpdate(billId, {
                status: 'PAID',
                paymentMethod: 'PAYPAL',
                paymentDate: new Date(),
                paypalTransactionId: capture.result.id
            }, { new: true });

            return res.json({
                success: true,
                message: "Thanh toán thành công",
                data: updatedBill
            });
        }
    } catch (error) {
        console.error('PayPal capture error:', error);
        
        // Kiểm tra nếu order đã được capture
        if (error.statusCode === 422 && 
            error._originalError?.text.includes('ORDER_ALREADY_CAPTURED')) {
            // Cập nhật bill status
            const updatedBill = await Bill.findByIdAndUpdate(billId, {
                status: 'PAID',
                paymentMethod: 'PAYPAL',
                paymentDate: new Date()
            }, { new: true });

            return res.json({
                success: true,
                message: "Thanh toán thành công",
                data: updatedBill
            });
        }

        return res.status(500).json({
            success: false,
            message: "Lỗi xử lý thanh toán",
            error: error.message
        });
    }
};

// Thêm hàm xử lý VNPAY
exports.createVNPayPayment = async (req, res) => {
    const { billId } = req.body;
    
    try {
        const bill = await Bill.findById(billId);
        
        if (!bill) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy hóa đơn'
            });
        }

        // Thêm kiểm tra trạng thái bill
        if (bill.status === 'PROCESSING') {
            return res.status(400).json({
                success: false, 
                message: 'Hóa đơn đang được xử lý'
            });
        }

        // Thêm timeout cho request
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Request timeout')), 30000);
        });

        const paymentPromise = createPaymentUrl(
            billId,
            bill.totalAmount,
            `Thanh toan hoa don ${billId}`
        );

        const paymentUrl = await Promise.race([paymentPromise, timeoutPromise]);

        // Cập nhật trạng thái bill
        await Bill.findByIdAndUpdate(billId, {
            status: 'PROCESSING',
            paymentMethod: 'VNPAY'
        });

        res.json({
            success: true,
            paymentUrl
        });

    } catch (error) {
        console.error('VNPAY payment error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi xử lý thanh toán: ' + error.message
        });
    }
};

// Thêm hàm xử lý callback từ VNPAY
exports.vnpayCallback = async (req, res) => {
    const vnp_Params = req.query;
    console.log('Raw VNPAY Params:', vnp_Params);
    
    try {
        // Kiểm tra các tham số bắt buộc
        const requiredParams = ['vnp_TxnRef', 'vnp_ResponseCode', 'vnp_TransactionNo', 'vnp_SecureHash'];
        const missingParams = requiredParams.filter(param => !vnp_Params[param]);
        
        if (missingParams.length > 0) {
            console.error('Missing required params:', missingParams);
            return res.redirect(`${process.env.CLIENT_URL}/tenant/bills?payment=failed&error=missing_params`);
        }

        // Verify signature
        const isValidSignature = verifyReturnUrl(vnp_Params);
        console.log('Signature verification result:', isValidSignature);
        
        if (!isValidSignature) {
            console.error('Invalid VNPAY signature');
            await Bill.findByIdAndUpdate(vnp_Params.vnp_TxnRef, {
                status: 'PENDING',
                paymentMethod: null
            });
            return res.redirect(`${process.env.CLIENT_URL}/tenant/bills?payment=failed&error=invalid_signature`);
        }

        // Xử lý thanh toán khi chữ ký hợp lệ
        const bill = await Bill.findById(vnp_Params.vnp_TxnRef);
        if (!bill) {
            return res.redirect(`${process.env.CLIENT_URL}/tenant/bills?payment=failed&error=bill_not_found`);
        }

        if (vnp_Params.vnp_ResponseCode === '00') {
            // Kiểm tra trùng lặp giao dịch
            if (bill.vnpayTransactionId === vnp_Params.vnp_TransactionNo) {
                return res.redirect(`${process.env.CLIENT_URL}/tenant/bills?payment=duplicate`);
            }

            await Bill.findByIdAndUpdate(vnp_Params.vnp_TxnRef, {
                status: 'PAID',
                paymentMethod: 'VNPAY',
                paymentDate: new Date(),
                vnpayTransactionId: vnp_Params.vnp_TransactionNo
            });

            return res.redirect(`${process.env.CLIENT_URL}/tenant/bills?payment=success`);
        } else {
            await Bill.findByIdAndUpdate(vnp_Params.vnp_TxnRef, {
                status: 'PENDING',
                paymentMethod: null
            });
            return res.redirect(`${process.env.CLIENT_URL}/tenant/bills?payment=failed&code=${vnp_Params.vnp_ResponseCode}`);
        }
    } catch (error) {
        console.error('VNPAY callback error:', error);
        return res.redirect(`${process.env.CLIENT_URL}/tenant/bills?payment=failed&error=server_error`);
    }
};
