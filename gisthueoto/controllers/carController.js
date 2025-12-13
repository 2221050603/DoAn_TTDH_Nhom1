const CarModel = require("../models/carModel");

const CarController = {
  getCarAddresses: async (req, res) => {
    try {
      const carAddresses = await CarModel.getAllAddresses();
      const seats = await CarModel.getSeats();
      const carBrands = await CarModel.getCarBrands();
      const cars = await CarModel.getCars();

      res.render("car_addresses", {
        carAddresses: carAddresses.rows,
        seats: seats.rows,
        carBrands: carBrands.rows,
        cars: cars.rows,
        results: []
      });

    } catch (err) {
      console.error(err);
      res.status(500).send("Lỗi server");
    }
  },

  getLocationsAPI: async (req, res) => {
    try {
      const result = await CarModel.getLocations();
      res.json(result.rows);
    } catch (err) {
      res.status(500).send("Lỗi khi lấy dữ liệu");
    }
  },

  listAddresses: async (req, res) => {
    try {
      const result = await CarModel.getAllAddresses();
      res.render("list_addresses", { carAddresses: result.rows });
    } catch (err) {
      console.error("Lỗi khi lấy danh sách:", err);
      res.status(500).send("Lỗi truy vấn dữ liệu");
    }
  }
};

module.exports = CarController;
