const express = require("express");
const router = express.Router();
const AddressController = require("../controllers/addressController");

router.get("/list_addresses", AddressController.listAddresses);
router.post("/delete_address/:id", AddressController.deleteAddress);
router.get("/edit_address/:id", AddressController.renderEditForm);
router.post("/edit_address/:id", AddressController.updateAddress);
router.get("/add_address_form", AddressController.renderAddForm);
router.post("/add_address", AddressController.addAddress);
// router.get("/api/locations", AddressController.getLocationsAPI);

module.exports = router;
