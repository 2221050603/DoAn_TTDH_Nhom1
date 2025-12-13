const pg = require("../db");

const HomeController = {
  redirectHome: (req, res) => {
    res.redirect("/trangchu");
  },

  dashboard: (req, res) => {
    const data = {
      totalCars: 50,
      rentalLocations: 10,
      ongoingRentals: 15,
      monthlyRevenue: "500 triệu VNĐ",
    };
    res.render("index", { data });
  },

  userHome: async (req, res) => {
  try {
    const sqlSeats = "SELECT * FROM seats";
    const sqlBrands = "SELECT * FROM car_brands";
    const sqlCars = "SELECT * FROM cars";
    const sqlAddresses = "SELECT * FROM car_addresses";

    const seats = await pg.query(sqlSeats);
    const carBrands = await pg.query(sqlBrands);
    const cars = await pg.query(sqlCars);
    const carAddresses = await pg.query(sqlAddresses);

    res.render("user", { 
      seats: seats.rows,
      carBrands: carBrands.rows,
      cars: cars.rows,
      carAddresses: carAddresses.rows,
      results: [] 
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Lỗi server");
  }
},

  guestHome: async (req, res) => {
    try {
      const sql = "SELECT * FROM car_addresses";
      const data = await pg.query(sql);
      res.render("trangchu", { carAddresses: data.rows });
    } catch (err) {
      res.status(500).send("Lỗi server");
    }
  },
};

module.exports = HomeController;
