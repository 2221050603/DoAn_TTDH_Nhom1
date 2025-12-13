const SearchModel = require("../models/searchModel");

const SearchController = {
  searchCars: async (req, res) => {
    try {
      const filters = req.body;
      const results = await SearchModel.search(filters);

      const seats = await SearchModel.getSeats();
      const brands = await SearchModel.getBrands();
      const cars = await SearchModel.getCars();

      res.render("user", {
        seats: seats.rows,
        carBrands: brands.rows,
        cars: cars.rows,
        results: results.rows,
      });

    } catch (err) {
      console.error(err);
      res.status(500).send("Lỗi tìm kiếm");
    }
  },
};

module.exports = SearchController;
