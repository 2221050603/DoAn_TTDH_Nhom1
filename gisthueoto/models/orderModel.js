const pg = require("../db");

const OrderModel = {
  getStore: (id) =>
    pg.query(
      "SELECT id, name, address, phone_number FROM car_addresses WHERE id = $1",
      [id]
    ),

  create: (data) => {
    const { storeId, customerName, orderDetails } = data;
    const sql =
      "INSERT INTO orders (store_id, customer_name, order_details) VALUES ($1, $2, $3)";
    return pg.query(sql, [storeId, customerName, orderDetails]);
  },
};

module.exports = OrderModel;
