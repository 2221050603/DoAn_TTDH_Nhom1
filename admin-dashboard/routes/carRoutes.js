const express = require("express");
const router = express.Router();
const pg = require("../db"); // Import kết nối từ db.js

// Route: Hiển thị dữ liệu địa chỉ xe (car_addresses)
router.get("/car_addresses", async (req, res) => {
  try {
    const sql = "SELECT id, address, name, long, lat, phone_number FROM car_addresses";
    const data = await pg.query(sql);

    // Gửi dữ liệu đến view "car_addresses.ejs"
    res.render("car_addresses", { carAddresses: data.rows });
  } catch (err) {
    console.error("Lỗi khi truy vấn dữ liệu:", err);
    res.status(500).send("Lỗi server khi truy vấn dữ liệu");
  }
});

// Route: API lấy dữ liệu địa chỉ xe
router.get("/api/locations", async (req, res) => {
  try {
    const sql = "SELECT id, address, name, long, lat FROM car_addresses";
    const result = await pg.query(sql);
    res.json(result.rows);
  } catch (err) {
    console.error("Lỗi khi lấy dữ liệu từ cơ sở dữ liệu:", err);
    res.status(500).send("Lỗi khi lấy dữ liệu");
  }
});

router.get("/list-addresses", async (req, res) => {
  try {
    const sql = "SELECT id, address, name, long, lat, phone_number FROM car_addresses"; // Query SQL
    const data = await pg.query(sql);  // Truy vấn dữ liệu từ PostgreSQL

    // Render view "list-addresses.ejs" và truyền dữ liệu vào
    res.render("list-addresses", { carAddresses: data.rows });
  } catch (err) {
    console.error("Lỗi khi truy vấn dữ liệu:", err);
    res.status(500).send("Lỗi server khi truy vấn dữ liệu");
  }
});

module.exports = router;
