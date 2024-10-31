const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();
const {
  createHostel,
  getHostelByLandLordId,
  getHostelById,
  getRoomById,
} = require("../controllers/landlord.controller");
const upload = require("../middlewares/uploadImage");

router.get("/hostel", getHostelByLandLordId);

router.get("/hostel/:hostelId", getHostelById);
//router.get("/hostel/:hostelId/create",)
router.get("/hostel/:roomId", getRoomById);
//router.get("/hostel/:roomId/create", )
//router.get("/hostel/:roomId/update", )
//router.get("/hostel/:roomId/updateUnit", )
//router.get("/hostel/:roomId/createReceipt",  )

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
