const express = require("express");

const Router = express.Router();

const scheduleController = require("./scheduleController");

// Router.get("/hello", scheduleController.getHello);
Router.get("/", scheduleController.getAllSchedule);
Router.get("/:id", scheduleController.getScheduleById);
Router.post("/", scheduleController.createSchedule);
Router.patch("/:id", scheduleController.updateSchedule);
Router.delete("/:id", scheduleController.deleteSchedule);

// Router.get("/hello", (request, response) => {
//   response.status(200);
//   response.send("Hello World");
// });

module.exports = Router;
