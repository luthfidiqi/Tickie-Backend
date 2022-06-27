const connection = require("../../config/mysql");

module.exports = {
  getCountSchedule: () =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT COUNT(*) AS total FROM schedule",
        (error, result) => {
          if (!error) {
            resolve(result[0].total);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),
  getAllSchedule: (searchLocation, sort, limit, startDate, offset) =>
    new Promise((resolve, reject) => {
      let query = `SELECT * FROM schedule LEFT JOIN movie ON schedule.movieId = movie.id`;

      if (searchLocation) {
        query = `${query} WHERE 
          schedule.location 
          LIKE "%${searchLocation}%"`;
      }

      if (startDate) {
        if (searchLocation) {
          query = `${query} AND 
            DATE(schedule.dateStart) LIKE '${startDate}'`;
          // schedule.dateStart >= '${startDate}' AND schedule.dateEnd <= '${endDate}'`;
        } else {
          query = `${query} WHERE
            DATE(schedule.dateStart) LIKE '${startDate}'`;
          // schedule.dateStart >= '${startDate}' AND schedule.dateEnd <= '${endDate}'`;
        }
      }

      connection.query(
        `${query} ORDER BY schedule.${sort} 
        LIMIT ? OFFSET ?`,
        [limit, offset],
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
  getScheduleById: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM schedule WHERE id = ?",
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
  createSchedule: (data) =>
    new Promise((resolve, reject) => {
      const query = connection.query(
        "INSERT INTO schedule SET ?",
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
  updateSchedule: (id, data) =>
    new Promise((resolve, reject) => {
      connection.query(
        "UPDATE schedule SET ? WHERE id = ?",
        [data, id],
        (error) => {
          if (!error) {
            const newResult = {
              id,
              ...data,
            };
            resolve(newResult);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),
  deleteSchedule: (id, data) =>
    new Promise((resolve, reject) => {
      connection.query("DELETE FROM schedule WHERE id = ?", id, (error) => {
        if (!error) {
          const newResult = {
            id,
            ...data,
          };
          resolve(newResult);
        } else {
          reject(new Error(error.sqlMessage));
        }
      });
    }),
};
