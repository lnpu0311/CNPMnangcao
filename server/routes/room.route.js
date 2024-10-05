const express = require("express");
const {
  getRoom,
  getRoomById,
  getRoomByHostelId,
  getRoomByTenantId,
  createRoom,
} = require("../controllers/room.controller");

const router = express.Router();

router.get("/", getRoom);
router.get("/:id", getRoomById);
router.get("/hostel/:id", getRoomByHostelId);
router.get("/tenant/:id", getRoomByTenantId);
router.post("/", createRoom);

module.exports = router;
