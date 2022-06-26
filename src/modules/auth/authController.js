const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const helperWrapper = require("../../helpers/wrapper");
const authModel = require("./authModel");
const { sendMail } = require("../../helpers/mail");
const redis = require("../../config/redis");

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
        id: uuidv4(),
        firstName,
        lastName,
        noTelp,
        email,
        password: hashPass,
      };

      const result = await authModel.register(setData);

      const setSendEmail = {
        to: email,
        subject: "Email Verification !",
        name: firstName,
        template: "verificationEmail.html",
        buttonUrl: "google.com",
      };
      
      await sendMail(setSendEmail);

      // const resultSendMail = await sendMail();
      // console.log(resultSendMail);

      return helperWrapper.response(
        response,
        200,
        "Success register user",
        result
      );
    } catch (error) {
      console.log(error);
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  login: async (request, response) => {
    try {
      const { email, password } = request.body;

      const checkUser = await authModel.getUserByEmail(email);

      // console.log(checkUser);

      //   1. jika email tidak ada did alam database
      if (checkUser.length < 1) {
        return helperWrapper.response(
          response,
          404,
          "Email not registed",
          null
        );
      }

      if ((await bcrypt.compare(password, checkUser[0].password)) == false) {
        return helperWrapper.response(response, 400, "Wrong password", null);
      }

      //   Proses JWT
      const payload = checkUser[0];
      delete payload.password;

      const token = jwt.sign({ ...payload }, "RAHASIA", { expiresIn: "1h" });
      const refreshToken = jwt.sign({ ...payload }, "RAHASIABARU", {
        expiresIn: "24h",
      });

      return helperWrapper.response(response, 200, "Success Login", {
        id: payload.id,
        token,
        refreshToken,
      });
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  refresh: async (request, response) => {
    try {
      console.log(request.body);
      const { refreshToken } = request.body;
      const checkToken = await redis.get(`refreshToken:${refreshToken}`);
      if (checkToken) {
        return helperWrapper.response(
          response,
          403,
          "Your refresh token cannot be use",
          null
        );
      }
      jwt.verify(refreshToken, "RAHASIABARU", async (error, result) => {
        delete result.iat;
        delete result.exp;
        const token = jwt.sign(result, "RAHASIA", { expiresIn: "1h" });
        const newRefreshToken = jwt.sign(result, "RAHASIABARU", {
          expiresIn: "24h",
        });
        await redis.setEx(
          `refreshToken:${refreshToken}`,
          3600 * 48,
          refreshToken
        );
        return helperWrapper.response(response, 200, "Success refresh token", {
          id: result.id,
          token,
          refreshToken: newRefreshToken,
        });
      });
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  logout: async (request, response) => {
    try {
      let token = request.headers.authorization;
      const { refreshToken } = request.body;
      token = token.split(" ")[1];
      redis.setEx(`accessToken:${token}`, 3600 * 24, token);
      redis.setEx(`refreshToken:${refreshToken}`, 3600 * 24, token);
      return helperWrapper.response(response, 200, "Success logout", null);
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
};
