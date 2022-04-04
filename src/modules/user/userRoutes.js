const express = require("express");

const Router = express.Router();
const userController = require("./userController");
const middlewareAuth = require("../../middleware/auth");
const middlewareRedis = require("../../middleware/redis");
const middlewareUploadUser = require("../../middleware/uploadUserImage");

Router.get("/:id", userController.getUserById);
Router.patch(
  "/profile/:id",
  middlewareAuth.authentication,
  userController.updateProfile
);
Router.patch(
  "/image/:id",
  middlewareAuth.authentication,
  middlewareUploadUser,
  userController.updateAvatar
);
Router.patch("/password/:id", userController.updatePassword);

module.exports = Router;
