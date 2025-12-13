const pg = require("../db");

const CarModel = {
  getAllAddresses: () => {
    const sql = `
      SELECT 
        id, 
        address, 
        name, 
        COALESCE(ST_X(geom), 0) AS long,
        COALESCE(ST_Y(geom), 0) AS lat,
        phone_number
      FROM car_addresses
    `;
    return pg.query(sql);
  },

  getLocations: () => {
  const sql = `
    SELECT
      a.id,
      a.name,
      a.address,
      COALESCE(ST_Y(a.geom), 0) AS lat,
      COALESCE(ST_X(a.geom), 0) AS long,

      COALESCE(
        json_agg(
          CASE 
            WHEN c.id IS NOT NULL THEN
              json_build_object(
                'model', c.model,
                'brand', b.name,
                'seats', s.seats,
                'price_per_day', c.price_per_day,
                'price_per_hour', c.price_per_hour
              )
          END
        ) FILTER (WHERE c.id IS NOT NULL),
        '[]'::json
      ) AS cars

    FROM car_addresses a
    LEFT JOIN cars c ON c.car_address_id = a.id
    LEFT JOIN car_brands b ON b.id = c.car_brand_id
    LEFT JOIN seats s ON s.id = c.seats_id

    GROUP BY a.id
    ORDER BY a.id;
  `;

  return pg.query(sql);
},


  getSeats: () => {
    const sql = "SELECT * FROM seats";
    return pg.query(sql);
  },

  getCarBrands: () => {
    const sql = "SELECT * FROM car_brands";
    return pg.query(sql);
  },

  getCars: () => {
    const sql = "SELECT * FROM cars";
    return pg.query(sql);
  },
};

module.exports = CarModel;
