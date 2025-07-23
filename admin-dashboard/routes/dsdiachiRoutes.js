const express = require("express");
const router = express.Router();
const pg = require("../db"); // Import kết nối từ db.js

// Route lấy danh sách địa chỉ
router.get('/api/locations', async (req, res) => {
  try {
    // Truy vấn dữ liệu từ bảng 'locations'
    const result = await client.query('SELECT name, address FROM car_addresses');
    
    // Trả về danh sách địa chỉ dưới dạng JSON
    res.json(result.rows);
  } catch (err) {
    console.error('Lỗi khi lấy dữ liệu từ cơ sở dữ liệu:', err);
    res.status(500).json({ message: 'Lỗi khi lấy dữ liệu' });
  }
});

module.exports = router;