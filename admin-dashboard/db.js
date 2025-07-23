const { Client } = require("pg");

const pg = new Client({
  user: "postgres",
  password: "emiuemiu",
  host: "localhost",
  port: 5432,
  database: "car_db1",
});

pg.connect((err) => {
  if (err) {
    console.error("Kết nối cơ sở dữ liệu thất bại:", err.stack);
  } else {
    console.log("Kết nối cơ sở dữ liệu thành công");
  }
});

module.exports = pg;
