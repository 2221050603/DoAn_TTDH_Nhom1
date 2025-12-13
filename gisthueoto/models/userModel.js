const pg = require("../db");

const UserModel = {
  getAllUsers: async () => {
    const sql = "SELECT id, fullname, username, password, phone, role FROM users";
    return pg.query(sql);
  },

  deleteUser: async (id) => {
    const sql = "DELETE FROM users WHERE id = $1";
    return pg.query(sql, [id]);
  },

  getUserById: async (id) => {
    const sql = "SELECT id, fullname, username, password, phone, role FROM users WHERE id = $1";
    return pg.query(sql, [id]);
  },

  updateUser: async (values) => {
    const sql = `
      UPDATE users 
      SET fullname=$1, username=$2, password=$3, phone=$4, role=$5 
      WHERE id=$6
    `;
    return pg.query(sql, values);
  }
};

module.exports = UserModel;
