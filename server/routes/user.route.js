const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");

const {
  getUser,
  getUserByRole,
  updateActive,
  updateUser,
  changePassword,
  searchAccommodation,
  getAllRooms
} = require("../controllers/user.controller");

// Lấy thông tin người dùng
router.get("/", authMiddleware(["tenant", "landlord", "manager"]), getUser);

// Lấy người dùng theo role
router.get(
  "/role/:role",
  authMiddleware(["manager"]),
  getUserByRole
);

// Cập nhật trạng thái active của user
router.put(
  "/active/:id",
  authMiddleware(["manager"]),
  updateActive
);

// Cập nhật thông tin user
router.put(
  "/update",
  authMiddleware(["tenant", "landlord", "manager"]),
  updateUser
);

// Đổi mật khẩu
router.put(
  "/change-password",
  authMiddleware(["tenant", "landlord", "manager"]),
  changePassword
);

// Lấy danh sách phòng cho tenant
router.get("/rooms", authMiddleware(["tenant"]), getAllRooms);

// Tìm kiếm phòng trọ
router.get("/search", authMiddleware(["tenant"]), searchAccommodation);

module.exports = router;
