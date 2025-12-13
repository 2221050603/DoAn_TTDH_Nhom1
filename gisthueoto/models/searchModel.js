const pg = require("../db");

const SearchModel = {
  search: (filters) => {
    const { seat_id, car_brand_id, car_id } = filters;

    const sql = `
      SELECT cars.id, cars.model, price_per_hour, price_per_day,
      car_brands.name AS brand_name,
      seats.seats AS seat_number,
      car_addresses.name AS store_name,
      car_addresses.address AS store_address,
      car_addresses.phone_number AS store_phone,
      car_addresses.long, car_addresses.lat
      FROM cars
      JOIN car_brands ON cars.car_brand_id = car_brands.id
      JOIN seats ON cars.seats_id = seats.id
      JOIN car_addresses ON cars.car_address_id = car_addresses.id
      WHERE ($1::int IS NULL OR seats.id = $1)
        AND ($2::int IS NULL OR car_brands.id = $2)
        AND ($3::int IS NULL OR cars.id = $3)
    `;

    return pg.query(sql, [
      seat_id || null,
      car_brand_id || null,
      car_id || null,
    ]);
  },

  getSeats: () => pg.query("SELECT * FROM seats"),
  getBrands: () => pg.query("SELECT * FROM car_brands"),
  getCars: () => pg.query("SELECT * FROM cars"),
};

module.exports = SearchModel;
