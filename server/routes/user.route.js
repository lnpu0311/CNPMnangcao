const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  getUser,
  getUserByRole,
  createUser,
  loginUser,
  updateActive,
  verifyOTP,
  updateUser,
  resendOtp,
  forgotPasword,
} = require("../controllers/user.controller");
const upload = require("../middlewares/uploadImage");
const router = express.Router();

//Quản trị Admin
router.get("/", authMiddleware(["admin"]), getUser);
router.get("/:role", authMiddleware(["admin"]), getUserByRole);
router.post("/activeAccount", authMiddleware(["admin"]), updateActive);
//Đăng ký, Đăng nhập cho Tenant và Landlord
router.post("/", upload.single("image"), createUser);
router.post("/login", loginUser);
router.post("/verifyOTP", verifyOTP);
router.post("/resendOtp", resendOtp);
router.post("/forgotPass", forgotPasword);
//Chỉnh sửa thông tin (Tenant và Landlord)
router.post(
  "/updateUser",
  authMiddleware(["tenant", "landlord"]),
  upload.single("image"),
  updateUser
);
//Tạo tài khoản Manager (chỉ Landlord làm được)
router.post("/manager/create", authMiddleware(["landlord"]));

module.exports = router;
