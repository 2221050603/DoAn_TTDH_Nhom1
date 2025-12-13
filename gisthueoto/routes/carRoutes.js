const express = require("express");
const router = express.Router();

const CarController = require("../controllers/carController");

router.get("/car_addresses", CarController.getCarAddresses);

router.get("/api/locations", CarController.getLocationsAPI);

router.get("/list-addresses", CarController.listAddresses);

module.exports = router;
