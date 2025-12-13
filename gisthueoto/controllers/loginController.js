const LoginModel = require("../models/loginModel");

const LoginController = {
  renderLoginForm: (req, res) => {
    res.render("login");
  },

  login: async (req, res) => {
    const { username, password } = req.body;

    try {
      const result = await LoginModel.findUser(username, password);

      if (result.rows.length === 0) {
        return res.send("Sai tên đăng nhập hoặc mật khẩu!");
      }

      const user = result.rows[0];

      if (user.role === "admin") {
        return res.redirect("/index");     
      } else {
        return res.redirect("/user");  
      }

    } catch (err) {
      console.error("Lỗi khi truy vấn dữ liệu:", err);
      res.status(500).send("Lỗi khi đăng nhập");
    }
  }
};

module.exports = LoginController;
