const express = require("express");
const router = express.Router();
const pg = require("../db");

router.get("/quanlixe", async (req, res) => {
  try {
    const sql = `
      SELECT 
          cars.id,
          cars.model,
          car_brands.name AS brand_name,
          car_addresses.address AS rental_location,
          seats.seats AS seat_number,
          cars.price_per_hour,
          cars.price_per_day
      FROM cars
      JOIN car_brands ON cars.car_brand_id = car_brands.id
      JOIN car_addresses ON cars.car_address_id = car_addresses.id
      JOIN seats ON cars.seats_id = seats.id;
    `;
    const result = await pg.query(sql);
    res.render("car_manager", { cars: result.rows });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách xe:", error);
    res.status(500).send("Lỗi khi truy vấn cơ sở dữ liệu");
  }
});

router.get('/cars/add', async (req, res) => {
  try {
    // Lấy danh sách car_brands và seats từ cơ sở dữ liệu
    const carBrands = await pg.query('SELECT * FROM car_brands');
    const seats = await pg.query('SELECT * FROM seats');
    
    // Render form với các dữ liệu lấy từ cơ sở dữ liệu
    res.render('add_car', {
      carBrands: carBrands.rows,
      seats: seats.rows,
    });
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu:', error);
    res.status(500).send('Lỗi hệ thống');
  }
});

// Route POST để thêm xe vào bảng cars và thêm địa chỉ mới vào car_addresses
router.post('/cars/add', async (req, res) => {
  const { model, rental_address, car_brand_id, seats_id, price_per_hour, price_per_day } = req.body;

  try {
    // Thêm địa chỉ mới vào bảng car_addresses
    const addressQuery = 'INSERT INTO car_addresses (address, name) VALUES ($1, $2) RETURNING id';
    const addressResult = await pg.query(addressQuery, [rental_address, rental_address]);
    
    const car_address_id = addressResult.rows[0].id;  // Lấy id của địa chỉ mới

    // Thêm xe vào bảng cars
    const carQuery = `
      INSERT INTO cars (model, car_address_id, car_brand_id, seats_id, price_per_hour, price_per_day)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING id
    `;
    const carValues = [model, car_address_id, car_brand_id, seats_id, price_per_hour, price_per_day];
    const carResult = await pg.query(carQuery, carValues);

    const newCarId = carResult.rows[0].id;  // Lấy id của xe mới thêm vào

    console.log('Xe mới đã được thêm:', newCarId);
    res.redirect('/quanlixe');  // Sau khi thêm xe, chuyển hướng về trang danh sách xe
  } catch (error) {
    console.error('Lỗi khi thêm xe:', error);
    res.status(500).send('Lỗi khi thêm xe');
  }
});

// Xóa xe
router.post('/cars/delete/:id', async (req, res) => {
  const carId = req.params.id;

  try {
    // Truy vấn để xóa xe
    const deleteQuery = 'DELETE FROM cars WHERE id = $1';
    const result = await pg.query(deleteQuery, [carId]);

    if (result.rowCount === 0) {
      return res.status(404).send('Xe không tìm thấy!');
    }

    req.flash('success_msg', 'Xe đã được xóa thành công!');

    // Chuyển hướng về trang danh sách xe sau khi xóa thành công
    res.redirect('/quanlixe');
  } catch (error) {
    console.error(error);
    res.status(500).send('Có lỗi xảy ra khi xóa xe');
  }
});

// Route GET để lấy thông tin xe và render form sửa
router.get('/cars/edit/:id', async (req, res) => {
  const carId = req.params.id;

  try {
    // Lấy thông tin xe từ bảng cars
    const carQuery = `SELECT * FROM cars WHERE id = $1`;
    const carResult = await pg.query(carQuery, [carId]);

    // Nếu không tìm thấy xe, trả về lỗi
    if (carResult.rowCount === 0) {
      return res.status(404).send('Xe không tìm thấy!');
    }

    // Lấy danh sách car_brands và seats
    const carBrands = await pg.query('SELECT * FROM car_brands');
    const seats = await pg.query('SELECT * FROM seats');

    // Render form sửa với dữ liệu xe và danh sách car_brands, seats
    res.render('edit_car', {
      car: carResult.rows[0],  // Truyền thông tin xe vào form
      carBrands: carBrands.rows,
      seats: seats.rows,
    });
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu xe:', error);
    res.status(500).send('Lỗi hệ thống');
  }
});

// Route POST để cập nhật thông tin xe
router.post('/cars/edit/:id', async (req, res) => {
  const carId = req.params.id;
  const { model, rental_address, car_brand_id, seats_id, price_per_hour, price_per_day } = req.body;

  try {
    // Lấy ID của địa chỉ mới (nếu cần cập nhật địa chỉ)
    const addressQuery = 'SELECT id FROM car_addresses WHERE address = $1';
    const addressResult = await pg.query(addressQuery, [rental_address]);

    // Nếu không tìm thấy địa chỉ, cần thêm mới vào bảng car_addresses
    let car_address_id;
    if (addressResult.rowCount === 0) {
      // Nếu không tìm thấy địa chỉ, thêm mới
      const addAddressQuery = 'INSERT INTO car_addresses (address, name) VALUES ($1, $2) RETURNING id';
      const addAddressResult = await pg.query(addAddressQuery, [rental_address, rental_address]);
      car_address_id = addAddressResult.rows[0].id;  // Lấy ID của địa chỉ mới
    } else {
      // Nếu đã có địa chỉ, sử dụng ID đã có
      car_address_id = addressResult.rows[0].id;
    }

    // Cập nhật thông tin xe vào bảng cars
    const updateCarQuery = `
      UPDATE cars
      SET model = $1, car_address_id = $2, car_brand_id = $3, seats_id = $4, price_per_hour = $5, price_per_day = $6
      WHERE id = $7
    `;
    const carValues = [model, car_address_id, car_brand_id, seats_id, price_per_hour, price_per_day, carId];
    await pg.query(updateCarQuery, carValues);

    // Sau khi cập nhật thành công, chuyển hướng về trang danh sách xe
    res.redirect('/quanlixe');
  } catch (error) {
    console.error('Lỗi khi cập nhật xe:', error);
    res.status(500).send('Lỗi khi cập nhật xe');
  }
});


module.exports = router;