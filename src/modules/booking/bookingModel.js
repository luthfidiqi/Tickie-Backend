const connection = require("../../config/mysql");

module.exports = {
  createBooking: (data) =>
    new Promise((resolve, reject) => {
      const query = connection.query(
        "INSERT INTO booking SET ?",
        data,
        (error, result) => {
          if (!error) {
            const newResult = {
              id: result.insertId,
              ...data,
            };
            resolve(newResult);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
      console.log(query.sql);
    }),
  createSeatBooking: (data) =>
    new Promise((resolve, reject) => {
      const query = connection.query(
        "INSERT INTO bookingseat SET ?",
        data,
        (error, result) => {
          if (!error) {
            const newResult = {
              id: result.insertId,
              ...data,
            };
            resolve(newResult);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
      console.log(query.sql);
    }),
  getBookingByUserId: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT booking.id, booking.userId, booking.scheduleId, booking.dateBooking, booking.timeBooking, booking.totalTicket, booking.totalPayment, booking.paymentMethod, booking.statusPayment, bookingSeat.seat, booking.statusUsed, schedule.premiere, user.firstName
        FROM booking 
        INNER JOIN bookingSeat
        ON booking.id = bookingSeat.bookingId
        JOIN schedule
        ON booking.scheduleId = schedule.id
        JOIN user
        ON booking.userId = user.id
        WHERE booking.id = ?`,
        id,
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),
  getBookingByBookingId: (id) =>
    new Promise((resolve, reject) => {
      const query = connection.query(
        `SELECT booking.id, booking.userId, booking.scheduleId, booking.dateBooking, booking.timeBooking, booking.totalTicket, booking.totalPayment, booking.paymentMethod, booking.statusPayment, bookingSeat.seat, booking.statusUsed, schedule.premiere
        FROM bookingSeat
        INNER JOIN booking
        ON bookingSeat.bookingId = booking.id
        JOIN schedule
        ON booking.scheduleId = schedule.id
        WHERE booking.id = ?`,
        id,
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
      console.log(query.sql);
    }),
};
