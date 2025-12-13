const express = require("express");
const router = express.Router();
const HomeController = require("../controllers/homeController");

router.get("/", HomeController.redirectHome);
router.get("/index", HomeController.dashboard);
router.get("/user", HomeController.userHome);
router.get("/trangchu", HomeController.guestHome);

module.exports = router;
