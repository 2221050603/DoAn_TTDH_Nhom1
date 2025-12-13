const CarManagerModel = require("../models/car_managerModel");

const CarManagerController = {
  getAllCars: async (req, res) => {
    try {
      const result = await CarManagerModel.getAllCars();
      res.render("car_manager", { cars: result.rows });
    } catch (error) {
      console.error("Lỗi khi lấy danh sách xe:", error);
      res.status(500).send("Lỗi khi truy vấn cơ sở dữ liệu");
    }
  },

  renderAddCarForm: async (req, res) => {
    try {
      const carBrands = await CarManagerModel.getCarBrands();
      const seats = await CarManagerModel.getSeats();
      res.render("add_car", {
        carBrands: carBrands.rows,
        seats: seats.rows,
      });
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
      res.status(500).send("Lỗi hệ thống");
    }
  },

  addCar: async (req, res) => {
    const { model, rental_address, car_brand_id, seats_id, price_per_hour, price_per_day } = req.body;
    try {
      const addressResult = await CarManagerModel.addAddress(rental_address);
      const car_address_id = addressResult.rows[0].id;

      const carResult = await CarManagerModel.addCar(
        model,
        car_address_id,
        car_brand_id,
        seats_id,
        price_per_hour,
        price_per_day
      );

      console.log("Xe mới đã được thêm:", carResult.rows[0].id);
      res.redirect("/quanlixe");
    } catch (error) {
      console.error("Lỗi khi thêm xe:", error);
      res.status(500).send("Lỗi khi thêm xe");
    }
  },

  deleteCar: async (req, res) => {
    const carId = req.params.id;
    try {
      const result = await CarManagerModel.deleteCar(carId);
      if (result.rowCount === 0) return res.status(404).send("Xe không tìm thấy!");
      res.redirect("/quanlixe");
    } catch (error) {
      console.error(error);
      res.status(500).send("Có lỗi xảy ra khi xóa xe");
    }
  },

  renderEditCarForm: async (req, res) => {
    const carId = req.params.id;
    try {
      const carResult = await CarManagerModel.getCarById(carId);
      if (carResult.rowCount === 0) return res.status(404).send("Xe không tìm thấy!");

      const carBrands = await CarManagerModel.getCarBrands();
      const seats = await CarManagerModel.getSeats();

      res.render("edit_car", {
        car: carResult.rows[0],
        carBrands: carBrands.rows,
        seats: seats.rows,
      });
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu xe:", error);
      res.status(500).send("Lỗi hệ thống");
    }
  },

  updateCar: async (req, res) => {
    const carId = req.params.id;
    const { model, rental_address, car_brand_id, seats_id, price_per_hour, price_per_day } = req.body;

    try {
      let addressResult = await CarManagerModel.findAddressByName(rental_address);
      let car_address_id;

      if (addressResult.rowCount === 0) {
        const newAddress = await CarManagerModel.addAddress(rental_address);
        car_address_id = newAddress.rows[0].id;
      } else {
        car_address_id = addressResult.rows[0].id;
      }

      await CarManagerModel.updateCar([
        model,
        car_address_id,
        car_brand_id,
        seats_id,
        price_per_hour,
        price_per_day,
        carId,
      ]);

      res.redirect("/quanlixe");
    } catch (error) {
      console.error("Lỗi khi cập nhật xe:", error);
      res.status(500).send("Lỗi khi cập nhật xe");
    }
  },
};

module.exports = CarManagerController;
