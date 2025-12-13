const AddressModel = require("../models/addressModel");

const AddressController = {

  listAddresses: async (req, res) => {
    try {
      const result = await AddressModel.getAll();
      res.render("list_addresses", { carAddresses: result.rows });
    } catch (err) {
      console.error(err);
      res.status(500).send("Lỗi server");
    }
  },

  deleteAddress: async (req, res) => {
    try {
      await AddressModel.delete(req.params.id);
      res.redirect("/list_addresses");
    } catch (err) {
      console.error(err);
      res.status(500).send("Lỗi khi xóa");
    }
  },

  renderEditForm: async (req, res) => {
    try {
      const result = await AddressModel.getOne(req.params.id);
      res.render("edit_address", { address: result.rows[0] });
    } catch (err) {
      console.error(err);
      res.status(500).send("Lỗi server");
    }
  },

  updateAddress: async (req, res) => {
    try {
      await AddressModel.update(req.params.id, req.body);
      res.redirect("/list_addresses");
    } catch (err) {
      console.error(err);
      res.status(500).send("Lỗi server");
    }
  },

  renderAddForm: (req, res) => {
    res.render("add_address");
  },

  addAddress: async (req, res) => {
    try {
      await AddressModel.create(req.body);
      res.redirect("/list_addresses");
    } catch (err) {
      console.error(err);
      res.status(500).send("Lỗi khi thêm");
    }
  },
};

module.exports = AddressController;
