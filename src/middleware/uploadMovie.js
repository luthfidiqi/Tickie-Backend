const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const helperWrapper = require("../helpers/wrapper");

// JIKA MENYIMPAN DATA DI CLOUDINARY
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "Tickitz/movie",
  },
});

// JIKA MENYIMPAN DATA DI DALAM PROJECT BACKEND
// const storage = multer.diskStorage({
//   destination(req, file, cb) {
//     cb(null, "public/uploads/movie");
//   },
//   filename(req, file, cb) {
//     // console.log(file);
//     // file = {
//     //   fieldname: 'image',
//     //   originalname: 'LogoFazztrack.png',
//     //   encoding: '7bit',
//     //   mimetype: 'image/png'
//     // }
//     cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
//   },
// });

// UNTUK PENGECEKAN LIMIT DAT EKSTENSI BISA DITAMBAHKAN DI MIDDLEWARE
// PROSES KONDISI LIMIT DAN CEK EXTENSI FILE IN HERE

// const limit = ..... // 1024 max 1mb / 500kb

const upload = multer({
  storage,
  // limit
}).single("image");

const handlingUpload = (request, response, next) => {
  upload(request, response, (error) => {
    if (error instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      return helperWrapper.response(response, 401, error.message, null);
      // limit = File to large
      // extensi = bisa di customize
    }
    if (error) {
      // An unknown error occurred when uploading.
      return helperWrapper.response(response, 401, error.message, null);
    }
    return next();
  });
};

module.exports = handlingUpload;
