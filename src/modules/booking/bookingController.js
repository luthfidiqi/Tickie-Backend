const helperWrapper = require("../../helpers/wrapper");
const bookingModel = require("./bookingModel");

module.exports = {
  createBooking: async (request, response) => {
    try {
      const {
        userId,
        scheduleId,
        dateBooking,
        timeBooking,
        paymentMethod,
        totalPayment,
        seat,
      } = request.body;

      const totalTicket = seat.length;
      const statusPayment = "success";
      const statusUsed = "active";

      const setData = {
        userId,
        scheduleId,
        dateBooking,
        timeBooking,
        totalTicket,
        totalPayment,
        paymentMethod,
        statusPayment,
        statusUsed,
      };
      const result = await bookingModel.createBooking(setData);

      // console.log(result.id);
      seat.map(async (item) => {
        const setDataSeat = {
          bookingid: result.id,
          seat: item,
        };
        await bookingModel.createSeatBooking(setDataSeat);
        // console.log(setDataSeat);
      });

      return helperWrapper.response(response, 200, "Success create data !", {
        result,
        seat,
      });
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  getBookingByUserId: async (request, response) => {
    try {
      const { id } = request.params;
      const result = await bookingModel.getBookingByUserId(id);

      if (result.length <= 0) {
        return helperWrapper.response(
          response,
          404,
          `Data by id ${id} not found`,
          null
        );
      }

      return helperWrapper.response(
        response,
        200,
        "Success get data !",
        result
      );
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  getBookingByBookingId: async (request, response) => {
    try {
      const { id } = request.params;
      const result = await bookingModel.getBookingByBookingId(id);

      if (result.length <= 0) {
        return helperWrapper.response(
          response,
          404,
          `Data by id ${id} not found`,
          null
        );
      }

      return helperWrapper.response(
        response,
        200,
        "Success get data !",
        result
      );
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  getSeat: async (request, response) => {
    try {
      const { scheduleId, dateBooking, timeBooking } = request.query;

      const result = await bookingModel.getSeat(
        scheduleId,
        dateBooking,
        timeBooking
      );

      return helperWrapper.response(
        response,
        200,
        "Success get data !",
        result
      );
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  getDashboard: async (request, response) => {
    try {
      let { scheduleId, movieId, location } = request.query;

      if (!scheduleId) {
        scheduleId = "";
      }
      if (!movieId) {
        movieId = "";
      }
      if (!location) {
        location = "";
      }

      const result = await bookingModel.getDashboard(
        scheduleId,
        movieId,
        location
      );

      if (result.length < 1) {
        return helperWrapper.response(response, 200, "Data not found", []);
      }

      const newResult = result.map((item) => {
        const data = {
          ...item,
          month: item.month.slice(0, 3),
        };

        return data;
      });

      return helperWrapper.response(
        response,
        200,
        "Success get data dashboard",
        newResult
      );
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  updateStatusBooking: async (request, response) => {
    try {
      const { id } = request.params;
      const result = await bookingModel.updateStatusBooking(id);

      if (result.length <= 0) {
        return helperWrapper.response(
          response,
          404,
          `Data by id ${id} not found`,
          null
        );
      }

      return helperWrapper.response(
        response,
        200,
        "Success get data !",
        result
      );
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
};
