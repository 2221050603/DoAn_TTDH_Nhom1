const pg = require("../db");

const RegisterModel = {
  createUser: async (values) => {
    const sql = `
      INSERT INTO users (fullname, username, password, phone, role)
      VALUES ($1, $2, $3, $4, $5)
    `;
    return pg.query(sql, values);
  }
};

module.exports = RegisterModel;
