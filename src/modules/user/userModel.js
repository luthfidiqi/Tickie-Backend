const connection = require("../../config/mysql");

module.exports = {
  cekId: (id) =>
    new Promise((resolve, reject) => {
      const cek = connection.query(
        `SELECT * FROM user WHERE id = '${id}'`,
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(`SQL : ${error.message}`));
          }
        }
      );
    }),

  cekEmail: (email) =>
    new Promise((resolve, reject) => {
      const test = connection.query(
        `SELECT * FROM user WHERE email = ?`,
        email,
        (error, result) => {
          if (!error) {
            resolve(result);
          } else reject(new Error(`SQL : ${error.message}`));
        }
      );
    }),

  updatePassword: (id, password) =>
    new Promise((resolve, reject) => {
      const tes = connection.query(
        `UPDATE user SET password = '${password}' WHERE id = '${id}'`,
        (error, result) => {
          if (!error) {
            result = id;
            resolve(result);
          } else {
            reject(new Error(`SQL : ${error.message}`));
          }
        }
      );
    }),

  updateProfile: (data, id) =>
    new Promise((resolve, reject) => {
      connection.query(
        `UPDATE user SET ? WHERE id = ?`,
        [data, id],
        (error, result) => {
          if (!error) {
            result = { ...data };
            resolve(result);
          } else {
            reject(new Error(`SQL : ${error.message}`));
          }
        }
      );
    }),

  updateAvatar: (id, data) =>
    new Promise((resolve, reject) => {
      tes = connection.query(
        `UPDATE user SET ? WHERE id = ?`,
        [data, id],
        (error, result) => {
          if (!error) {
            const newResult = { id, ...data };
            resolve(newResult);
          } else {
            reject(new Error(`SQL : ${error.message}`));
          }
        }
      );
    }),

  getUserById: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM user WHERE id = ?",
        id,
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),
};
