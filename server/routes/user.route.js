const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  getUser,
  getUserByRole,
  updateActive,
  updateUser,
  changePassword,
  searchAccommodation
} = require("../controllers/user.controller");
const upload = require("../middlewares/uploadImage");
const router = express.Router();

//Quản trị Admin
router.get("/", authMiddleware(["admin"]), getUser);
router.get("/:role", authMiddleware(["admin"]), getUserByRole);
router.post("/activeAccount", authMiddleware(["admin"]), updateActive);

//Chỉnh sửa thông tin (Tenant và Landlord)
router.post(
  "/updateUser",
  authMiddleware(["tenant", "landlord"]),
  upload.single("image"),
  updateUser
);
//Search ( cho cả tenant và landlord)
router.get('/search',authMiddleware(["tenant","landlord"]),
searchAccommodation);

//Đổi mật khẩu
router.put(
  "/change-password",
  authMiddleware(["tenant", "landlord", "manager"]),
  changePassword
);

//Tạo tài khoản Manager (chỉ Landlord làm được)
router.post("/manager/create", authMiddleware(["landlord"]));

module.exports = router;
