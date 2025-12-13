const pg = require("../db");

const AddressModel = {
  getAll: () => pg.query(`
  SELECT 
    a.id,
    a.name,
    a.address,
    a.phone_number,
    ST_Y(a.geom) AS lat,
    ST_X(a.geom) AS long,

    -- Lấy danh sách xe có tại địa điểm này
    json_agg(
      json_build_object(
        'model', c.model,
        'brand', b.name,
        'seats', s.seats,
        'price_per_day', c.price_per_day,
        'price_per_hour', c.price_per_hour
      )
    ) AS cars

  FROM car_addresses a
  LEFT JOIN cars c ON c.car_address_id = a.id
  LEFT JOIN car_brands b ON c.car_brand_id = b.id
  LEFT JOIN seats s ON c.seats_id = s.id

  GROUP BY a.id
`),

  delete: (id) =>
    pg.query("DELETE FROM car_addresses WHERE id = $1", [id]),

getOne: (id) => pg.query(`
  SELECT 
    id,
    name,
    address,
    phone_number,
    ST_Y(geom) AS lat,
    ST_X(geom) AS long
  FROM car_addresses
  WHERE id = $1
`, [id]),

  update: (id, data) => {
  const { address, name, long, lat, phone_number } = data;
  const sql = `
    UPDATE car_addresses 
    SET 
      address = $1,
      name = $2,
      phone_number = $3,
      geom = ST_SetSRID(ST_MakePoint($4::float, $5::float), 4326)
    WHERE id = $6
  `;
  return pg.query(sql, [address, name, phone_number, long, lat, id]);
},

  create: (data) => {
  const { storeName, address, lat, long, phone_number } = data;
  const sql = `
    INSERT INTO car_addresses (name, address, phone_number, geom)
    VALUES (
      $1, $2, $3,
      ST_SetSRID(ST_MakePoint($4::float, $5::float), 4326)
    )
  `;
  return pg.query(sql, [storeName, address, phone_number, long, lat]);
}
};

module.exports = AddressModel;
