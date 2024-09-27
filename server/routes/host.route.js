const express = require("express");
const {
  getHost,
  createHost,
  getHostById,
} = require("../controllers/host.controller");

const router = express.Router();

router.get("/", getHost);
router.get("/:id", getHostById);
router.post("/", createHost);

module.exports = router;
