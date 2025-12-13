const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController");

router.get("/user_manager", UserController.getUsers);

router.post("/delete_user/:id", UserController.deleteUser);

router.get("/edit_user/:id", UserController.renderEditForm);

router.post("/edit_user/:id", UserController.updateUser);

module.exports = router;
