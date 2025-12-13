const db = require("../db");

const LoginModel = {
  findUser: async (username, password) => {
    const sql = "SELECT * FROM users WHERE username = $1 AND password = $2";
    return db.query(sql, [username, password]);
  }
};

module.exports = LoginModel;
