const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const helperWrapper = require("../helpers/wrapper");

// Menyimpan data dalam cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "Tickitz/movie",
  },
});

const destroy = multer({ storage }).single("image");

const handlingDestroy = (request, response, next) => {
  destroy(request, response, (error) => {
    if (error instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      return helperWrapper.response(response, 401, error.message, null);
    }
    if (error) {
      // An unknown error occurred when uploading.
      return helperWrapper.response(response, 401, error.message, null);
    }
    return next();
  });
};

module.exports = handlingDestroy;

// const destroy = multer({ storage }).single("image");

// module.exports = destroy;
