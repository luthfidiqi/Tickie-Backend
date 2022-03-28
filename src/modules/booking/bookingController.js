const helperWrapper = require("../../helpers/wrapper");
const bookingModel = require("./bookingModel");

module.exports = {
  createBooking: async (request, response) => {
    try {
      const {
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
};
