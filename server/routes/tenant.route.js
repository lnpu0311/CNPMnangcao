const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  getTenant,
  createTenant,
  getTenantById,
  loginTenant,
} = require("../controllers/tenant.controller");

const router = express.Router();

router.get("/", authMiddleware(true), getTenant);
router.get("/:id", authMiddleware, getTenantById);
router.post("/", createTenant);
router.post("/login", loginTenant);
module.exports = router;
