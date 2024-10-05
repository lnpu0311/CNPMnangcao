const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  getLandLord,
  createLandLord,
  getLandLordById,
  loginLandLord,
} = require("../controllers/landLord.controller");

const router = express.Router();

router.get("/", authMiddleware(false), getLandLord);
router.get("/:id", authMiddleware, getLandLordById);
router.post("/", createLandLord);
router.post("/login", loginLandLord);

module.exports = router;
