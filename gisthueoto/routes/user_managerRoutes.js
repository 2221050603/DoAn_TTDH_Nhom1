const express = require("express");
const router = express.Router();
const pg = require("../db"); // Import kết nối từ db.js

// Route: Hiển thị dữ liệu địa chỉ danh sách người dùng
router.get("/user_manager", async (req, res) => {
  try {
    const sql = "SELECT id, fullname, username, password, phone, role FROM users";
    const data = await pg.query(sql);  // Dữ liệu lấy từ PostgreSQL

    // Truyền dữ liệu `data` vào giao diện
    res.render("user_manager", { users: data.rows });  // Sử dụng `data.rows` để lấy danh sách người dùng

  } catch (error) {
    console.error("Lỗi khi lấy danh sách người dùng:", error);
    res.status(500).send("Lỗi khi truy vấn cơ sở dữ liệu");
  }
});

// Route: Xóa người dùng
router.post("/delete_user/:id", async (req, res) => {
  const userId = req.params.id; // Lấy id người dùng từ URL

  try {
    const sql = "DELETE FROM users WHERE id = $1";
    await pg.query(sql, [userId]);  // Thực hiện xóa người dùng

    res.redirect("/user_manager");  // Sau khi xóa xong, chuyển hướng về danh sách người dùng

  } catch (error) {
    console.error("Lỗi khi xóa người dùng:", error);
    res.status(500).send("Lỗi khi xóa người dùng");
  }
});

// Route: Hiển thị form sửa thông tin người dùng
router.get("/edit_user/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    const sql = "SELECT id, fullname, username, password, phone, role FROM users WHERE id = $1";
    const result = await pg.query(sql, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).send("Người dùng không tồn tại");
    }

    res.render("edit_user", { user: result.rows[0] });

  } catch (error) {
    console.error("Lỗi khi lấy thông tin người dùng:", error);
    res.status(500).send("Lỗi khi lấy thông tin người dùng");
  }
});

// Route: Hiển thị form sửa thông tin người dùng
router.get("/edit_user/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    const sql = "SELECT id, fullname, username, password, phone, role FROM users WHERE id = $1";
    const result = await pg.query(sql, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).send("Người dùng không tồn tại");
    }

    res.render("edit_user", { user: result.rows[0] });

  } catch (error) {
    console.error("Lỗi khi lấy thông tin người dùng:", error);
    res.status(500).send("Lỗi khi lấy thông tin người dùng");
  }
});



module.exports = router;
