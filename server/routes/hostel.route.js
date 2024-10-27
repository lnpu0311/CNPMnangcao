const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  getHostel,
  getHostelById,
  createHostel,
  getHostelByUserId,
} = require("../controllers/hostel.controller");
const upload = require("../middlewares/uploadImage");
const router = express.Router();

//Quản trị Admin
router.get("/", authMiddleware(["admin", "landlord"]), getHostel);
router.get("/:id", authMiddleware(["admin"]), getHostelById);
//Quản trị
router.get(
  "/host/:id",
  authMiddleware(["admin", "landlord", "manager"]),
  getHostelByUserId
);
//Đăng cơ sở (chỉ landlord)
router.post(
  "/",
  authMiddleware(["admin"]),
  upload.single("image"),
  createHostel
);

module.exports = router;
