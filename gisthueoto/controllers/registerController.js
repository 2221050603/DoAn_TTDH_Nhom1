const RegisterModel = require("../models/registerModel");

const RegisterController = {

  renderRegisterForm: (req, res) => {
    res.render("register");
  },

  registerUser: async (req, res) => {
    const { fullname, username, password, phone } = req.body;

    // ==== VALIDATION ====
    if (!fullname || !username || !password || !phone) {
      return res.status(400).json({ success: false, message: "Vui lòng điền đầy đủ thông tin" });
    }

    if (username.length < 8) {
      return res.status(400).json({ success: false, message: "Tên đăng nhập phải có ít nhất 8 ký tự" });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: "Mật khẩu phải có tối thiểu 6 ký tự" });
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      return res.status(400).json({ success: false, message: "Số điện thoại phải gồm 10 chữ số" });
    }

    try {
      // Thêm user với role mặc định
      await RegisterModel.createUser([
        fullname,
        username,
        password,
        phone,
        "user"
      ]);

      // ==== 🔥 TRẢ JSON CHO AJAX ====
      return res.json({ success: true, message: "Đăng ký thành công" });

    } catch (err) {
      console.error("Lỗi khi đăng ký:", err);

      // Lỗi UNIQUE (username hoặc phone đã tồn tại)
      if (err.code === "23505") {
        return res.status(400).json({
          success: false,
          message: "Tên đăng nhập hoặc số điện thoại đã tồn tại"
        });
      }

      return res.status(500).json({ success: false, message: "Lỗi server khi đăng ký" });
    }
  }
};

module.exports = RegisterController;
