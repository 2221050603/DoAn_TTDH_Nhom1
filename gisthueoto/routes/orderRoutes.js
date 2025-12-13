const express = require("express");
const router = express.Router();
const OrderController = require("../controllers/orderController");

router.get("/order/:id", OrderController.renderOrderForm);
router.post("/submit-order", OrderController.submitOrder);

module.exports = router;
