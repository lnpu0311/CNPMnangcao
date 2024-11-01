const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();
const {
  createHostel,
  getHostelByLandLordId,
  getHostelById,
  getRoomById,
  createRoom,
} = require("../controllers/landlord.controller");
const upload = require("../middlewares/uploadImage");

router.get("/hostel", authMiddleware(["landlord"]), getHostelByLandLordId);

router.get("/hostel/:hostelId", getHostelById);
//router.get("/hostel/:hostelId/create",createHostel)
router.get("/hostel/:roomId", getRoomById);
//router.get("/hostel/:roomId/update", )
//router.get("/hostel/:roomId/updateUnit", )
//router.get("/hostel/:roomId/createReceipt",  )

//Đăng cơ sở (chỉ landlord)
router.post(
  "/room/:hostelId/create",
  authMiddleware(["landlord"]),
  upload.array("images", 5), // Cho phép tải lên tối đa 5 ảnh
  createRoom
);
//Tạo tài khoản Manager (chỉ Landlord làm được)
router.post("/manager/create", authMiddleware(["landlord"]));

module.exports = router;
