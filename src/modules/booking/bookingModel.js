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
        WHERE booking.userId = ?`,
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
        `SELECT booking.id, booking.scheduleId, booking.dateBooking, booking.timeBooking, booking.totalTicket, booking.totalPayment, booking.paymentMethod, booking. statusPayment, booking.statusUsed, bookingSeat.seat, bookingSeat.createdAt, bookingSeat.updatedAt, movie.name, movie.category
        FROM booking
        JOIN bookingSeat
        ON booking.id = bookingSeat.bookingId
        JOIN schedule
        ON booking.scheduleId = schedule.id
        JOIN movie
        ON schedule.movieId = movie.id
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
  getSeat: (scheduleId, dateBooking, timeBooking) =>
    new Promise((resolve, reject) => {
      const query = connection.query(
        `SELECT bookingSeat.id, bookingSeat.seat 
        FROM bookingSeat 
        JOIN booking
        ON bookingSeat.bookingId = booking.id 
        WHERE booking.scheduleId = '${scheduleId}' 
        OR booking.dateBooking = '${dateBooking}' 
        OR booking.timeBooking = '${timeBooking}'`,
        [scheduleId, dateBooking, timeBooking],
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(`SQL : ${error.sqlMessage}`));
          }
        }
      );
      console.log(query.sql);
    }),
  getDashboard: (scheduleId, movieId, location) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT MONTHNAME(booking.createdAt) AS month, 
        SUM(booking.totalPayment) AS total 
        FROM booking
        JOIN schedule
        ON booking.scheduleId = schedule.id
        WHERE YEAR(booking.createdAt) = YEAR(NOW()) 
        AND booking.scheduleId LIKE '%${scheduleId}%' 
        AND schedule.movieId LIKE '%${movieId}%' 
        AND schedule.location LIKE '%${location}%' 
        GROUP BY MONTHNAME(booking.createdAt)`,
        (err, result) => {
          if (!err) {
            resolve(result);
          } else {
            reject(new Error(`SQL : ${err.sqlMessage}`));
          }
        }
      );
    }),
  updateStatusBooking: (id) =>
    new Promise((resolve, reject) => {
      const query = connection.query(
        `UPDATE booking
        SET statusUsed ='nonActive'
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
