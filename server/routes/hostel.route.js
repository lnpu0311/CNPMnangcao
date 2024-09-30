const express = require("express");
const {
  getHostel,
  getHostelById,
  createHostel,
  getHostelByHostId,
} = require("../controllers/hostel.controller");

const router = express.Router();

router.get("/", getHostel);
router.get("/:id", getHostelById);
router.get("/host/:id", getHostelByHostId);
router.post("/", createHostel);

module.exports = router;
