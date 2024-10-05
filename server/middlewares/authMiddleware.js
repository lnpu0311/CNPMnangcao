const jwt = require("jsonwebtoken");

const Admin = require("../models/admin.model");
const LandLord = require("../models/landLord.model");
const Tenant = require("../models/tenant.model");

const authMiddleware = (requireAdmin = false) => {
  return async (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Không có token" });
    }

    try {
      // Giải mã token
      const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);

      let user;
      // Xác định loại người dùng là Là admin hay không
      if (requireAdmin && req.user.is_admin !== 1) {
        return res.status(403).json({
          success: false,
          message: "Truy cập bị từ chối, không phải admin",
        });
      } else if (requireAdmin && req.user.is_admin === 1) {
        user = await Admin.findById(decoded.id);
      }
      // Xác định loại người dùng là LandLord hay Tenant từ token
      if (decoded.model === "landLord") {
        user = await LandLord.findById(decoded.id);
      } else if (decoded.model === "tenant") {
        user = await Tenant.findById(decoded.id);
      }

      // Nếu không tìm thấy người dùng
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "Người dùng không tồn tại" });
      }

      req.user = user; // Lưu thông tin người dùng trong request
      next(); // Cho phép tiếp tục
    } catch (error) {
      return res.status(401).json({ success: false, message: error.message });
    }
  };
};

module.exports = authMiddleware;
