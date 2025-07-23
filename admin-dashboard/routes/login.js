const express = require('express');
const router = express.Router();
const db = require('../db'); // Kết nối DB

// Route hiển thị form đăng nhập
router.get('/', (req, res) => {
  res.render('login');
});

// Route xử lý đăng nhập
router.post('/', async (req, res) => {
  const { username, password } = req.body;

  try {
    const query = 'SELECT * FROM users WHERE username = $1 AND password = $2';
    const values = [username, password];
    const result = await db.query(query, values);

    if (result.rows.length > 0) {
      // Đăng nhập thành công, chuyển hướng đến trang index
      res.redirect('/index'); // Chuyển hướng tới trang index
    } else {
      res.send('Sai tên đăng nhập hoặc mật khẩu!');
    }
  } catch (err) {
    console.error('Lỗi khi truy vấn dữ liệu:', err);
    res.status(500).send('Lỗi khi đăng nhập');
  }
});

module.exports = router;

