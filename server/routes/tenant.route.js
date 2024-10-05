const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  getTenant,
  createTenant,
  getTenantById,
  loginTenant,
} = require("../controllers/tenant.controller");
const {
  createRentPayment,
  executeRentPayment,
} = require("../controllers/rentPayment.controller");
const router = express.Router();

router.get("/", authMiddleware(true), getTenant);
router.get("/:id", authMiddleware, getTenantById);
router.post("/", createTenant);
router.post("/login", loginTenant);

router.post("/create-rent-payment", authMiddleware, createRentPayment);
router.get("/execute-rent-payment", authMiddleware, executeRentPayment);
module.exports = router;
