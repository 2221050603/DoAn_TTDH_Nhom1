const express = require("express");
const router = express.Router();

const RegisterController = require("../controllers/registerController");

router.get("/", RegisterController.renderRegisterForm);

router.post("/", RegisterController.registerUser);

module.exports = router;
