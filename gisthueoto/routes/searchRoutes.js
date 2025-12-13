const express = require("express");
const router = express.Router();
const SearchController = require("../controllers/searchController");

router.post("/search", SearchController.searchCars);

module.exports = router;
