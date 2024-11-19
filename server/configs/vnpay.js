const crypto = require('crypto');
const qs = require('qs');

console.log('VNPAY Config:', {
    tmnCode: process.env.VNPAY_TMCODE,
    hashSecret: process.env.VNPAY_HASHSECRET,
    url: process.env.VNPAY_URL,
    returnUrl: process.env.VNP_RETURN_URL
});

if (!process.env.VNPAY_HASHSECRET) {
    throw new Error('VNPAY_HASHSECRET is not configured in environment variables');
}

console.log('Hash Secret:', process.env.VNPAY_HASHSECRET);

exports.vnpayConfig = {
    tmnCode:process.env.VNPAY_TMCODE,
    hashSecret:process.env.VNPAY_HASHSECRET,
    url:process.env.VNPAY_URL,
    returnUrl: process.env.VNP_RETURN_URL,
};
exports.createPaymentUrl = (orderId,amount,orderInfo,locale='vn')=>{
    // Validate input parameters
    if (!orderId || !amount || !orderInfo) {
        throw new Error('Missing required parameters');
    }

    // Ensure amount is positive and is an integer
    const validAmount = Math.floor(Math.abs(amount));
    
    const date = new Date();
    
    // Format date theo chuẩn yyyyMMddHHmmss
    const createDate = date.getFullYear().toString() +
        ("0" + (date.getMonth() + 1)).slice(-2) +
        ("0" + date.getDate()).slice(-2) +
        ("0" + date.getHours()).slice(-2) +
        ("0" + date.getMinutes()).slice(-2) +
        ("0" + date.getSeconds()).slice(-2);

    const vnp_Params = {
        vnp_Version:'2.1.0',
        vnp_Command:'pay',
        vnp_TmnCode : exports.vnpayConfig.tmnCode,
        vnp_Locale:locale,
        vnp_CurrCode:'VND',
        vnp_TxnRef:orderId.toString(),
        vnp_OrderInfo:orderInfo,
        vnp_OrderType:'billpayment',
        vnp_Amount:validAmount *100,
        vnp_ReturnUrl:exports.vnpayConfig.returnUrl,
        vnp_IpAddr: '127.0.0.1',
        vnp_CreateDate: createDate,
        vnp_BankCode: '',
        vnp_SecureHashType: 'SHA512'
    };

    // Sắp xếp các tham số theo alphabet và loại bỏ các giá trị rỗng
    const sortedParams = Object.keys(vnp_Params)
        .filter(key => vnp_Params[key] !== '' && vnp_Params[key] !== null && vnp_Params[key] !== undefined)
        .sort()
        .reduce((acc, key) => ({
            ...acc,
            [key]: vnp_Params[key]
        }), {});

    // Tạo chuỗi ký KHÔNG mã hóa URL
    const signData = Object.entries(sortedParams)
        .map(([key, value]) => `${key}=${value}`)
        .join('&');

    // Tạo chữ ký
    const hmac = crypto.createHmac('sha512', exports.vnpayConfig.hashSecret);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    // Thêm chữ ký vào params
    sortedParams['vnp_SecureHash'] = signed;

    // Tạo URL thanh toán với các tham số đã được mã hóa
    const paymentUrl = `${exports.vnpayConfig.url}?` + 
        Object.entries(sortedParams)
            .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
            .join('&');

    return paymentUrl;
};

exports.verifyReturnUrl = (vnp_Params) => {
    const secureHash = vnp_Params['vnp_SecureHash'];
    
    // Tạo bản sao của params để không ảnh hưởng đến object gốc
    const verifyParams = { ...vnp_Params };
    
    // Xóa các trường không cần thiết
    delete verifyParams['vnp_SecureHash'];
    delete verifyParams['vnp_SecureHashType'];
    
    // Sắp xếp các tham số theo thứ tự alphabet
    const sortedParams = Object.keys(verifyParams)
        .sort()
        .reduce((acc, key) => {
            if (verifyParams[key] !== undefined && verifyParams[key] !== '') {
                acc[key] = verifyParams[key];
            }
            return acc;
        }, {});
    
    // Tạo chuỗi ký từ các tham số đã sắp xếp
    const signData = Object.entries(sortedParams)
        .map(([key, value]) => `${key}=${value}`)
        .join('&');
    
    // Tạo chữ ký mới
    const hmac = crypto.createHmac('sha512', exports.vnpayConfig.hashSecret);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
    
    // So sánh chữ ký
    return secureHash === signed;
};
