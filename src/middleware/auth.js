const req = require("express/lib/request");
const jwt = require("jsonwebtoken");
const helperWrapper = require("../helpers/wrapper");

module.exports = {
  authentication: async (request, response, next) => {
    let token = request.headers.authorization;

    if (!token) {
      return helperWrapper.response(response, 403, "Please login first", null);
    }

    token = token.split(" ")[1];

    const checkRedis = await redis.get(`accessToken:${token}`);
    if (checkRedis) {
      return helperWrapper.response(
        response,
        403,
        "Your token is destroyed please login again",
        null
      );
    }

    jwt.verify(token, "Secret", (error, result) => {
      if (error) {
        return helperWrapper.response(response, 403, error.message, null);
      }
      console.log(result);

      request.decodeToken = result;
      //   decodeToken = data user yang login
      next();
    });
  },
  isAdmin: (request, response, next) => {
    if (request.decodeToken.role !== "admin") {
      return helperWrapper.response(
        response,
        403,
        "Only Admin That Can Do This Feature"
      );
    }
    next();
  },
};
