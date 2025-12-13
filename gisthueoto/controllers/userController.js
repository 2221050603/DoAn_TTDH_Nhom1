const UserModel = require("../models/userModel");

const UserController = {
  getUsers: async (req, res) => {
    try {
      const result = await UserModel.getAllUsers();
      res.render("user_manager", { users: result.rows });
    } catch (error) {
      console.error("Lỗi khi lấy danh sách người dùng:", error);
      res.status(500).send("Lỗi khi truy vấn cơ sở dữ liệu");
    }
  },

  deleteUser: async (req, res) => {
    try {
      await UserModel.deleteUser(req.params.id);
      res.redirect("/user_manager");
    } catch (error) {
      console.error("Lỗi khi xóa người dùng:", error);
      res.status(500).send("Lỗi khi xóa người dùng");
    }
  },

  renderEditForm: async (req, res) => {
    try {
      const result = await UserModel.getUserById(req.params.id);

      if (result.rows.length === 0) {
        return res.status(404).send("Người dùng không tồn tại");
      }

      res.render("edit_user", { user: result.rows[0] });
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
      res.status(500).send("Lỗi khi lấy thông tin người dùng");
    }
  },

  updateUser: async (req, res) => {
    const { fullname, username, password, phone, role } = req.body;

    try {
      await UserModel.updateUser([
        fullname, username, password, phone, role, req.params.id
      ]);

      res.redirect("/user_manager");
    } catch (error) {
      console.error("Lỗi khi cập nhật người dùng:", error);
      res.status(500).send("Lỗi khi cập nhật người dùng");
    }
  }
};

module.exports = UserController;
