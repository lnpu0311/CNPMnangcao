const router = require("express").Router();
const {
  getRoom,
  getRoomById,
  getRoomByHostelId,
  createRoom,
} = require("../controllers/room.controller");

router.get("/", getRoom);
router.get("/:id", getRoomById);
router.get("/hostel/:id", getRoomByHostelId);
router.post("/", createRoom);

module.exports = router;
