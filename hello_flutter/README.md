<<<<<<< HEAD
# hello_flutter

A new Flutter project.

## Getting Started

This project is a starting point for a Flutter application.

A few resources to get you started if this is your first Flutter project:

- [Lab: Write your first Flutter app](https://docs.flutter.dev/get-started/codelab)
- [Cookbook: Useful Flutter samples](https://docs.flutter.dev/cookbook)

For help getting started with Flutter development, view the
[online documentation](https://docs.flutter.dev/), which offers tutorials,
samples, guidance on mobile development, and a full API reference.
=======
# appthueoto
<<<<<<< HEAD
đồ án 

Clone về máy bằng lệnh sau: git clone https://github.com/dohoangvugit/appthueoto


để nhóm hoạt động hiệu quả, hãy cố gắng làm theo các bước sau khi dùng GitHub

B1: Hãy kiểm tra repo trước khi bắt tay vào làm bằng lệnh 'git status'
B2: Nếu có thay đổi trên repo hãy dùng 'git pull origin main' để kéo thay đổi về 

Trước khi đẩy code lên hãy làm theo các bước sau

B1: Dùng lệnh 'git add .' để thêm vào staging
B2: Commit lại các thay đổi bằng ' git commit -m ' tao thay đổi cái này '
B3: Đẩy lên repo ' git push origin main'

Hướng dẫn làm bài

- Tạo thư mục chưa dự án này và clone về đó
- Tạo 1 thư mục đồng cấp với dự án để BE ví dụ: car_backend
- Trong car_backend mở terminal và chạy lệnh sau
npm init -y
npm install express pg cors

-tạo file app.js ( có thể tách phần kết nôi csdl thành db.js rồi import vào app.js)
  // app.js
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

// Kết nối PostgreSQL
const db = new Pool({
  user: 'postgres',     
  password: '123456',  // tự sửa mật khẩu
  host: 'localhost',
  port: 5432,
  database: 'car_db'    // đúng tên database bạn đã import
});

// API danh sách xe
app.get('/cars', async (req, res) => {
  try {
    const sql = `
      SELECT c.id, c.model, cb.name AS brand,
             s.seats, c.price_per_day, ca.address
      FROM cars c
      JOIN car_brands cb ON cb.id = c.car_brand_id
      JOIN seats s ON s.id = c.seats_id
      JOIN car_addresses ca ON ca.id = c.car_address_id
      ORDER BY c.id;
    `;
    const result = await db.query(sql);
    res.json(result.rows);
  } catch (err) {
    console.error('Lỗi /cars:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await db.query(
      'SELECT * FROM users WHERE username=$1 AND password=$2',
      [username, password]
    );
    if (result.rows.length > 0) res.json(result.rows[0]);
    else res.status(401).json({ error: 'Sai tài khoản hoặc mật khẩu' });
  } catch (err) {
    console.error('Lỗi /login:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Server chạy tại http://localhost:${PORT}`));

- Chạy ứng dụng bằng 'node app.js' rồi truy cập vào API để kiểm tra xem đã chạy được hay chưa http://localhost:3000/cars

Lưu ý trong phần pubspec.yaml của flutter, trong dependencies hãy kiểm tra xem có đúng như đoạn dưới đây không, nếu không thì sửa cho đúng ( chắc là đúng đấy )

dependencies:
  flutter:
    sdk: flutter
  http: ^1.2.0

- Sau khi api chạy thành công thì chạy flutter bằng 'flutter run'
  

>>>>>>> 8fe039db498d86327f00ad4d093e5280ecbd9303
=======
doanchuyennganh
>>>>>>> 4e1b452fcfb3807f01c63b441e68a17c592ed7a8
