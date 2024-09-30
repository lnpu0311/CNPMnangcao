const express = require("express");
const {
  getTenant,
  createTenant,
  getTenantById,
} = require("../controllers/tenant.controller");

const router = express.Router();

router.get("/", getTenant);
router.get("/:id", getTenantById);
router.post("/", createTenant);

module.exports = router;
