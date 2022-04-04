const express = require("express");

const Router = express.Router();

const bookingController = require("./bookingController");

// Router.get("/hello", bookingController.getHello);
Router.post("/", bookingController.createBooking);
Router.get("/id/:id", bookingController.getBookingByBookingId);
Router.get("/user/:id", bookingController.getBookingByUserId);

// Router.get("/hello", (request, response) => {
//   response.status(200);
//   response.send("Hello World");
// });

module.exports = Router;
