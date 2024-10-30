const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();
const {
  createHostel,
  getHostelByLandLordId,
} = require("../controllers/landlord.controller");
const upload = require("../middlewares/uploadImage");

router.get("/hostel", getHostelByLandLordId);
//Đăng cơ sở (chỉ landlord)
router.post(
  "/",
  authMiddleware(["landlord"]),
  upload.single("image"),
  createHostel
);

//Tạo tài khoản Manager (chỉ Landlord làm được)
router.post("/manager/create", authMiddleware(["landlord"]));

module.exports = router;
