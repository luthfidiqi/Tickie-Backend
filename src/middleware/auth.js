const req = require("express/lib/request");
const jwt = require("jsonwebtoken");
const helperWrapper = require("../helpers/wrapper");

module.exports = {
  authentication: (request, response, next) => {
    let token = request.headers.authorization;

    if (!token) {
      return helperWrapper.response(response, 403, "Please login first", null);
    }

    token = token.split(" ")[1];

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
        "ONLY ADMIN THAT CAN DO THIS FEATURE"
      );
    }
    next();
  },
};
