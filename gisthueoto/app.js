const express = require("express");
const { Client } = require("pg");
const app = express();
const path = require("path");
const port = 3000;
const pg = require("./db");
const carRoutes = require("./routes/carRoutes");
const car_managerRoutes = require("./routes/car_managerRoutes");
const user_managerRoutes = require("./routes/user_managerRoutes");
const registerRoute = require('./routes/register');
const loginRoute = require('./routes/login');

// Cấu hình đường dẫn cho static files (CSS, JS)
app.use(express.static(path.join(__dirname, "public")));

// Cấu hình view engine (ejs)
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.redirect("/trangchu");
});

// Trang chủ (dashboard)
app.get("/index", (req, res) => {
  // Dữ liệu giả lập
  const data = {
    totalCars: 50,
    rentalLocations: 10,
    ongoingRentals: 15,
    monthlyRevenue: "500 triệu VNĐ",
  };
  res.render("index", { data });
});

app.get('/list_addresses', async (req, res) => {
  try {
    const sql = 'SELECT id, address, name, long, lat, phone_number FROM car_addresses';
    const data = await pg.query(sql);

    res.render('list_addresses', { carAddresses: data.rows });
  } catch (err) {
    console.error('Lỗi khi truy vấn dữ liệu:', err);
    res.status(500).send('Lỗi server khi truy vấn dữ liệu');
  }
});
app.post('/delete_address/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const sql = 'DELETE FROM car_addresses WHERE id = $1';
    await pg.query(sql, [id]);

    // Chuyển hướng về trang danh sách địa chỉ
    res.redirect('/list_addresses');
  } catch (err) {
    console.error('Lỗi khi xóa dữ liệu:', err);
    res.status(500).send('Lỗi server khi xóa dữ liệu');
  }
});

app.get('/edit_address/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const sql = 'SELECT * FROM car_addresses WHERE id = $1';
    const result = await pg.query(sql, [id]);
    const address = result.rows[0];

    res.render('edit_address', { address });
  } catch (err) {
    console.error('Lỗi khi truy vấn dữ liệu:', err);
    res.status(500).send('Lỗi server khi truy vấn dữ liệu');
  }
});
app.post('/edit_address/:id', async (req, res) => {
  const { id } = req.params;
  const { address, name, long, lat, phone_number } = req.body;

  try {
    const sql = `
      UPDATE car_addresses 
      SET address = $1, name = $2, long = $3, lat = $4, phone_number = $5
      WHERE id = $6
    `;
    await pg.query(sql, [address, name, long, lat, phone_number, id]);

    // Chuyển hướng về trang danh sách địa chỉ
    res.redirect('/list_addresses');
  } catch (err) {
    console.error('Lỗi khi cập nhật dữ liệu:', err);
    res.status(500).send('Lỗi server khi cập nhật dữ liệu');
  }
});

app.get('/add_address_form', (req, res) => {
  res.render('add_address');  // Trang form thêm cửa hàng
});
app.post('/add_address', async (req, res) => {
  const { storeName, address, lat, long, phone_number } = req.body;

  // Câu lệnh SQL để chèn dữ liệu vào bảng car_addresses
  const query = `
    INSERT INTO car_addresses (name, address, lat, long, phone_number)
    VALUES ($1, $2, $3, $4, $5)
  `;

  try {
    await pg.query(query, [storeName, address, lat, long, phone_number]);
    res.redirect('/list_addresses'); // Chuyển hướng về trang danh sách địa chỉ
  } catch (err) {
    console.error("Lỗi khi thêm cửa hàng:", err);
    res.status(500).send("Lỗi server khi thêm cửa hàng");
  }
});

// Trang chủ user
app.get("/user", async (req, res) => {
  try {
    // Truy vấn dữ liệu từ bảng car_addresses
    let sql = "SELECT id, address, name, long, lat, phone_number FROM car_addresses";
    let data = await pg.query(sql);
    console.log(data.rows); // Log ra dữ liệu để kiểm tra

    // Gửi dữ liệu đến view "car_addresses.ejs"
    res.render("user", { carAddresses: data.rows });
  } catch (err) {
    console.error("Lỗi khi truy vấn dữ liệu:", err);
    res.status(500).send("Lỗi server khi truy vấn dữ liệu");
  }
});

// Trang chủ khi chưa đăng nhập 
app.get("/trangchu", async (req, res) => {
  try {
    // Truy vấn dữ liệu từ bảng car_addresses
    let sql = "SELECT id, address, name, long, lat, phone_number FROM car_addresses";
    let data = await pg.query(sql);
    console.log(data.rows); // Log ra dữ liệu để kiểm tra

    // Gửi dữ liệu đến view "car_addresses.ejs"
    res.render("trangchu", { carAddresses: data.rows });
  } catch (err) {
    console.error("Lỗi khi truy vấn dữ liệu:", err);
    res.status(500).send("Lỗi server khi truy vấn dữ liệu");
  }
});

// // Tạo  route để lấy và hiện dữ liệu
// app.get("/", async (reg, res)=> {
//   await pg.connect()
//   .catch( err => console.error('Lỗi kết nối đến PostgreSQL', err))
//   .then(() => console.log('Connected to PostgreSQL database'));

//   let sql = "select id, address, name, long, lat, phone_number from car_addresses";
//   let data = await pg.query(sql);
//   console.log(data.rows)
//   res.render("car_addresses", { carAddresses: data.rows });

// })

// Route để lấy và hiển thị dữ liệu địa chỉ xe từ cơ sở dữ liệu
app.get("/car_addresses", async (req, res) => {
  try {
    // Truy vấn dữ liệu từ bảng car_addresses
    let sql = "SELECT id, address, name, long, lat, phone_number FROM car_addresses";
    let carAddressesData = await pg.query(sql);
    console.log(carAddressesData.rows); // Log ra dữ liệu để kiểm tra

    // Truy vấn thêm dữ liệu từ bảng seats, car_brands, cars
    const seats = await pg.query(`SELECT * FROM seats`);
    const carBrands = await pg.query(`SELECT * FROM car_brands`);
    const cars = await pg.query(`SELECT * FROM cars`);

    // Gửi dữ liệu đến view "car_addresses.ejs"
    res.render("car_addresses", {
      carAddresses: carAddressesData.rows,
      seats: seats.rows,
      carBrands: carBrands.rows,
      cars: cars.rows,
      results: [] // Mặc định không có kết quả tìm kiếm
    });

  } catch (err) {
    console.error("Lỗi khi truy vấn dữ liệu:", err);
    res.status(500).send("Lỗi server khi truy vấn dữ liệu");
  }
});


app.get("/order/:id", async (req, res) => {
  try {
    const storeId = req.params.id;

    // Truy vấn thông tin cửa hàng từ cơ sở dữ liệu dựa trên ID
    const sql = "SELECT id, name, address, phone_number FROM car_addresses WHERE id = $1 ";
    const result = await pg.query(sql, [storeId]);

    if (result.rows.length === 0) {
      return res.status(404).send("Không tìm thấy cửa hàng.");
    }

    // Render trang đặt hàng với thông tin cửa hàng
    res.render("order", { store: result.rows[0] });
  } catch (err) {
    console.error("Lỗi khi truy vấn dữ liệu:", err);
    res.status(500).send("Lỗi server khi xử lý yêu cầu. Chi tiết lỗi: " + err.message);
  }
});



app.post("/submit-order", async (req, res) => {
  try {
    const { storeId, customerName, orderDetails } = req.body;
    // Lưu đơn hàng vào cơ sở dữ liệu
    const sql = "INSERT INTO orders (store_id, customer_name, order_details) VALUES ($1, $2, $3)";
    await pg.query(sql, [storeId, customerName, orderDetails]);

    res.send("Đơn hàng đã được gửi thành công!");
  } catch (err) {
    console.error("Lỗi khi xử lý đơn hàng:", err);
    res.status(500).send("Lỗi server khi xử lý đơn hàng.");
  }
});





app.get("/api/locations", async (req, res) => {
  try {
    const sql = "SELECT id, address, name, long, lat FROM car_addresses";
    const result = await pg.query(sql);
    res.json(result.rows);
  } catch (err) {
    console.error("Lỗi khi lấy dữ liệu từ cơ sở dữ liệu:", err);
    res.status(500).send("Lỗi khi lấy dữ liệu");
  }
});

// Route xử lý tìm kiếm
app.post('/search', async (req, res) => {
  const { seat_id, car_brand_id, car_id } = req.body;

  try {
    const query = `
      SELECT cars.id, cars.model, price_per_hour, price_per_day,
      car_brands.name AS brand_name,
      seats.seats AS seat_number,
      car_addresses.name AS store_name,
      car_addresses.address AS store_address,
      car_addresses.phone_number AS store_phone,
      car_addresses.long , car_addresses.lat
      FROM cars
      JOIN car_brands ON cars.car_brand_id = car_brands.id
      JOIN seats ON cars.seats_id = seats.id
      JOIN car_addresses ON cars.car_address_id = car_addresses.id
      WHERE ($1::int IS NULL OR seats.id = $1)
        AND ($2::int IS NULL OR car_brands.id = $2)
        AND ($3::int IS NULL OR cars.id = $3)
    `;
    const results = await pg.query(query, [
      seat_id || null,
      car_brand_id || null,
      car_id || null,
    ]);

    // Truy vấn thêm dữ liệu cho dropdowns
    const seats = await pg.query("SELECT * FROM seats");
    const carBrands = await pg.query("SELECT * FROM car_brands");
    const cars = await pg.query("SELECT * FROM cars");

    // Render lại trang với kết quả tìm kiếm
    res.render("car_addresses", {
      carAddresses: [], // Không cần hiển thị địa chỉ xe khi tìm kiếm
      seats: seats.rows,
      carBrands: carBrands.rows,
      cars: cars.rows,
      results: results.rows // Truyền kết quả tìm kiếm
    });
  } catch (err) {
    res.status(500).send('Error fetching search results');
  }
});

 

app.use('/register', registerRoute);
app.use('/login', loginRoute);
app.use("/", carRoutes);
app.use("/", car_managerRoutes);
app.use("/", user_managerRoutes);

// Lắng nghe cổng
app.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`);
});
