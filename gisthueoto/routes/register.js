// routes/register.js
const express = require('express');
const router = express.Router();
const pg = require('../db'); // Kết nối đến database

// Hiển thị form đăng ký
router.get('/', (req, res) => {
  res.render('register');
});

// Xử lý đăng ký người dùng (POST)
router.post('/', async (req, res) => {
  // Lấy dữ liệu từ form gửi lên
  const { fullname, username, password, phone, role } = req.body;

  // Kiểm tra nếu có thông tin còn thiếu
  if (!fullname || !username || !password || !phone || !role) {
    return res.status(400).send('Vui lòng điền đầy đủ thông tin');
  }

  try {
    // Truy vấn SQL để lưu thông tin người dùng vào cơ sở dữ liệu
    const sql = 'INSERT INTO users (fullname, username, password, phone, role) VALUES ($1, $2, $3, $4, $5)';
    const values = [fullname, username, password, phone, role];
    
    // Thực hiện truy vấn SQL
    await pg.query(sql, values);
    
    // Sau khi đăng ký thành công, chuyển hướng đến login sau 3 giây
    setTimeout(() => {
      res.redirect('/login');  // Chuyển hướng đến trang login
    }, 3000); // 3 giây
  } catch (err) {
    console.error('Lỗi khi đăng ký:', err);
    res.status(500).send('Lỗi khi đăng ký');
  }
});
module.exports = router;
