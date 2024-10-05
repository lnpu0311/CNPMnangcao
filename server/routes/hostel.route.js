const express = require("express");
const {
  getHostel,
  getHostelById,
  createHostel,
  getHostelByLandLordId,
} = require("../controllers/hostel.controller");

const router = express.Router();

router.get("/", getHostel);
router.get("/:id", getHostelById);
router.get("/host/:id", getHostelByLandLordId);
router.post("/", createHostel);

module.exports = router;
