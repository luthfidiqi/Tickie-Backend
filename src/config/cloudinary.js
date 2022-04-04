const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "luthfidiqi",
  api_key: "518332985143343",
  api_secret: "B2Z75R4l4RfnjgePe7mLL9kClL4",
});

module.exports = cloudinary;
