const cloudinary = require("cloudinary").v2;

// Implement ENV
require("dotenv").config();

// cloudinary.config({
//   cloud_name: "luthfidiqi",
//   api_key: "518332985143343",
//   api_secret: "B2Z75R4l4RfnjgePe7mLL9kClL4",
// });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;
