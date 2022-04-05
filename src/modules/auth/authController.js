const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const helperWrapper = require("../../helpers/wrapper");
const authModel = require("./authModel");
const sendMail = require("../../helpers/email");
require("dotenv").config();

module.exports = {
  register: async (request, response) => {
    try {
      const { firstName, lastName, noTelp, email, password } = request.body;

      // 1. encrypt password
      const hashPass = await bcrypt.hash(password, 10);
      // 2. Tambahkan proses kondisi untuk mengecek apakah email sudah terdaftar atau belum
      const checkUser = await authModel.getUserByEmail(email);
      if (checkUser.length >= 1) {
        return helperWrapper.response(
          response,
          404,
          "Email has been registered",
          null
        );
      }

      const setData = {
        firstName,
        lastName,
        noTelp,
        email,
        password: hashPass,
      };

      const result = await authModel.register(setData);

      const setDataEmail = {
        to: email,
        subject: "Verification Email",
        data: {
          firstName,
          lastName,
        },
      };
      await sendMail(setDataEmail);

      return helperWrapper.response(
        response,
        200,
        "Success register user",
        result
      );
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  login: async (request, response) => {
    try {
      const { email, password } = request.body;

      const checkUser = await authModel.getUserByEmail(email);

      console.log(checkUser);

      //   1. jika email tidak ada did alam database
      if (checkUser.length < 1) {
        return helperWrapper.response(
          response,
          404,
          "Email not registed",
          null
        );
      }

      // 2. jika password ketika di cocokkan salah
      // if (password !== checkUser[0].password) {
      //   return helperWrapper.response(response, 400, "Wrong password", null);
      // }

      if ((await bcrypt.compare(password, checkUser[0].password)) == false) {
        return helperWrapper.response(response, 400, "Wrong password", null);
      }

      //   Proses JWT
      const payload = checkUser[0];
      delete payload.password;

      const token = jwt.sign({ ...payload }, "Secret", { expiresIn: "24h" });

      return helperWrapper.response(response, 200, "Success Login", {
        id: payload.id,
        token,
      });
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
};
