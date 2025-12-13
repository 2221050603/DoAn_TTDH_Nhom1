const express = require("express");
const router = express.Router();
const CarManagerController = require("../controllers/car_managerController");

// Routes
router.get("/quanlixe", CarManagerController.getAllCars);
router.get("/cars/add", CarManagerController.renderAddCarForm);
router.post("/cars/add", CarManagerController.addCar);
router.post("/cars/delete/:id", CarManagerController.deleteCar);
router.get("/cars/edit/:id", CarManagerController.renderEditCarForm);
router.post("/cars/edit/:id", CarManagerController.updateCar);

module.exports = router;
