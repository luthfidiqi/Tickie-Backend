const express = require("express");

const Router = express.Router();

const movieRoutes = require("../modules/movie/movieRoutes");

Router.use("/movie", movieRoutes);

const scheduleRoutes = require("../modules/schedule/scheduleRoutes");

Router.use("/schedule", scheduleRoutes);

// Router.get("/hello", (request, response) => {
//   response.status(200);
//   response.send("Hello World");
// });

module.exports = Router;
