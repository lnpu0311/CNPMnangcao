const {paypalClient} = require("../configs/paypal");
const checkoutNodeJssdk = require("@paypal/checkout-server-sdk");

// Hàm tạo thanh toán tiền thuê
exports.createRentPayment = async (req, res) =>{
    const {rentFee,electricityFee,waterFee,serviceFee} = req.body;

    const totalAmount = rentFee + electricityFee + waterFee + serviceFee;
    const request = new checkoutNodeJssdk.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
        intent: "CAPTURE",
        purchase_units: [{
            amount: {
                currency_code: 'USD',
                value: totalAmount.toFixed(2),
                breakdown:{
                    item_total:{
                        currency_code: 'VND',
                        value: totalAmount.toFixed(2)
                    }
                }
            },
            items: [
                {
                    name : "Tiền nhà",
                    unit_amount :{
                        currency_code: 'VND',
                        value: rentFee.toFixed(2)
                    },
                    quantity :"1"
                },
                {
                    name: "Tiền điện ",
                    unit_amount:{
                        currency_code: 'VND',
                        value: electricityFee.toFixed(2)
                    },
                    quantity: "1"
                },
                {
                    name: "Tiền nước",
                    unit_amount:{
                        currency_code:'VND',
                        value: waterFee.toFixed(2)
                    },
                    quantity:"1"
                },
                {
                    name : "Tiền Dịch vụ",
                    unit_amount:{
                        currency_code: "VND",
                        value: serviceFee.toFixed(2)
                    },
                    quantity: "1"
                }
            ]
        }]
    });
    try{
        // Thực thi yêu cầu thanh toán  PayPal
        const response = await paypalClient.execute(request);
        res.json(response.data);
    }catch(error){
        res.status(500).send({error: err.message});
    }
};
exports.executeRentPayment = async (req, res) =>{
     // Lấy ID đơn hàng PayPal từ query parameters
    const rentPaymentId = req.query.rentPaymentId;
    
    // Tạo một yêu cầu capture mới cho đơn hàng
    const request = new checkoutNodeJssdk.orders.OrdersCaptureRequest(rentPaymentId);
    request.requestBody({});

    try{
        const capture  = await paypalClient.execute(request);

        res.json({
            captureId: capture.data.id,
            status: capture.data.status,
            payerName:capture.result.payer.name.given_name,
            amount: capture.result.purchase_units[0].payments.captures[0].amount.value
        });
    }catch(err){
        res.status(500).send({error:err.message});
    }
}
