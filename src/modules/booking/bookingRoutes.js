const express = require("express");

const Router = express.Router();

const bookingController = require("./bookingController");
const middlewareAuth = require("../../middleware/auth");

Router.post(
  "/",
  middlewareAuth.authentication,
  bookingController.createBooking
);
Router.get(
  "/id/:id",
  middlewareAuth.authentication,
  bookingController.getBookingByBookingId
);
Router.get(
  "/user/:id",
  middlewareAuth.authentication,
  bookingController.getBookingByUserId
);
Router.get("/seat/", middlewareAuth.authentication, bookingController.getSeat);
Router.get(
  "/dashboard/",
  middlewareAuth.authentication,
  middlewareAuth.isAdmin,
  bookingController.getDashboard
);
Router.patch(
  "/ticket/:id",
  middlewareAuth.authentication,
  bookingController.updateStatusBooking
);

module.exports = Router;
