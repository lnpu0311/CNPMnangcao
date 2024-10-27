const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  getUser,
  getUserByRole,
  updateActive,
  updateUser,
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
//Tạo tài khoản Manager (chỉ Landlord làm được)
router.post("/manager/create", authMiddleware(["landlord"]));

module.exports = router;
