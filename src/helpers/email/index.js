/* eslint-disable no-unused-vars */
const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const path = require("path");
require("dotenv").config();

const sendMail = (data) =>
  new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      service: `gmail`,
      auth: {
        user: process.env.gmail_email,
        pass: process.env.gmail_pass,
      },
    });

    const mailOptions = {
      from: `Tickie - Booking Ticket <emailtesting.lutas@gmail.com>`,
      to: `lutasdev@gmail.com`,
      subject: `Email Verification`,
      text: `Please Verify your email`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error);
      } else {
        console.log(`Email Sent ${info.response}`);
        resolve(info.response);
      }
    });
    console.log("PROSES SEND MAIL WORKS");
  });

module.exports = sendMail;
