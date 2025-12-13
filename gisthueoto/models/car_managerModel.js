const pg = require("../db");

const CarManagerModel = {
  getAllCars: async () => {
    const sql = `
      SELECT 
          cars.id,
          cars.model,
          car_brands.name AS brand_name,
          car_addresses.address AS rental_location,
          seats.seats AS seat_number,
          cars.price_per_hour,
          cars.price_per_day
      FROM cars
      JOIN car_brands ON cars.car_brand_id = car_brands.id
      JOIN car_addresses ON cars.car_address_id = car_addresses.id
      JOIN seats ON cars.seats_id = seats.id;
    `;
    return pg.query(sql);
  },

  getCarById: async (id) => {
    return pg.query("SELECT * FROM cars WHERE id = $1", [id]);
  },

  getCarBrands: async () => pg.query("SELECT * FROM car_brands"),
  getSeats: async () => pg.query("SELECT * FROM seats"),

  addAddress: async (address) => {
    const sql = "INSERT INTO car_addresses (address, name) VALUES ($1, $2) RETURNING id";
    return pg.query(sql, [address, address]);
  },

  addCar: async (model, car_address_id, car_brand_id, seats_id, price_per_hour, price_per_day) => {
    const sql = `
      INSERT INTO cars (model, car_address_id, car_brand_id, seats_id, price_per_hour, price_per_day)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING id
    `;
    return pg.query(sql, [model, car_address_id, car_brand_id, seats_id, price_per_hour, price_per_day]);
  },

  deleteCar: async (id) => {
    return pg.query("DELETE FROM cars WHERE id = $1", [id]);
  },

  findAddressByName: async (address) => {
    return pg.query("SELECT id FROM car_addresses WHERE address = $1", [address]);
  },

  updateCar: async (values) => {
    const sql = `
      UPDATE cars
      SET model = $1, car_address_id = $2, car_brand_id = $3, seats_id = $4, price_per_hour = $5, price_per_day = $6
      WHERE id = $7
    `;
    return pg.query(sql, values);
  },
};

module.exports = CarManagerModel;
