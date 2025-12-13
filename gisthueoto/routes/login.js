const express = require("express");
const router = express.Router();

const LoginController = require("../controllers/loginController");

// Hiển thị form đăng nhập
router.get("/", LoginController.renderLoginForm);

// Xử lý đăng nhập
router.post("/", LoginController.login);

module.exports = router;
