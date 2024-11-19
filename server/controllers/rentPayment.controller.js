const {paypalClient} = require("../configs/paypal");
const checkoutNodeJssdk = require("@paypal/checkout-server-sdk");
const Bill = require('../models/bill.model');

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
