const helperWrapper = require("../../helpers/wrapper");
const bookingModel = require("./bookingModel");

const helperMidtrans = require("../../helpers/midtrans");

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

      const setDataMidtrans = {
        id: result.id,
        total: result.totalPayment,
      }
      console.log(setDataMidtrans);

      const resultMidtrans = await helperMidtrans.post(setDataMidtrans);

      return helperWrapper.response(response, 200, "Success create data !", {
        ...result, seat, redirectUrl: resultMidtrans.redirect_url,
      });
    } catch (error) {
      console.log(error);
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  postMidtransNotification: async (request, response) => {
    try {
      console.log(request.body);
      const result = await helperMidtrans.notif(request.body);
      const orderId = result.order_id;
      const transactionStatus = result.transaction_status;
      const fraudStatus = result.fraud_status;

      console.log(
        `Transaction notification received. Order ID: ${orderId}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}`
      );

      // Sample transactionStatus handling logic

      if (transactionStatus == "capture") {
        // capture only applies to card transaction, which you need to check for the fraudStatus
        if (fraudStatus == "challenge") {
          // TODO set transaction status on your databaase to 'challenge'
          // UBAH STATUS PEMBAYARAN MENJADI PENDING
          // PROSES MEMANGGIL MODEL untuk mengubah data di dalam database
          // id = orderId;
          const setData = {
            paymentMethod: result.payment_type,
            statusPayment: "PENDING",
            // updatedAt: ...
          };
        } else if (fraudStatus == "accept") {
          // TODO set transaction status on your databaase to 'success'
          // UBAH STATUS PEMBAYARAN MENJADI SUCCESS
          // id = orderId;
          const setData = {
            paymentMethod: result.payment_type,
            statusPayment: "SUCCESS",
            // updatedAt: ...
          };
        }
      } else if (transactionStatus == "settlement") {
        // TODO set transaction status on your databaase to 'success'
        // UBAH STATUS PEMBAYARAN MENJADI SUCCESS
        // id = orderId;
        const setData = {
          paymentMethod: result.payment_type,
          statusPayment: "SUCCESS",
          // updatedAt: ...
        };
        console.log(
          `Sukses melakukan pembayaran dengan id ${orderId} dan data yang diubah ${JSON.stringify(
            setData
          )}`
        );
      } else if (transactionStatus == "deny") {
        // TODO you can ignore 'deny', because most of the time it allows payment retries
        // and later can become success
        // UBAH STATUS PEMBAYARAN MENJADI FAILED
      } else if (
        transactionStatus == "cancel" ||
        transactionStatus == "expire"
      ) {
        // TODO set transaction status on your databaase to 'failure'
        // UBAH STATUS PEMBAYARAN MENJADI FAILED
      } else if (transactionStatus == "pending") {
        // TODO set transaction status on your databaase to 'pending' / waiting payment
        // UBAH STATUS PEMBAYARAN MENJADI PENDING
      }
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
