const multer = require("multer");
const path = require("path");

// Allowed image file extensions
const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif"];

// Configure multer for file upload with size limit and file filter
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./images");
  },
  filename: function (req, file, cb) {
    console.log("file=====>", file.name);
    cb(
      null,
      `${Date.now()}-${Math.floor(Math.random() * 1e9)}${path.extname(
        file.originalname
      )}`
    );
  },
});

const fileFilter = function (req, file, cb) {
  // Check if the file mimetype starts with "image/"
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("Only image files are allowed!"), false);
  }

  // Check if the file extension is in the allowedExtensions array
  const ext = path.extname(file.originalname).toLowerCase();
  if (!allowedExtensions.includes(ext)) {
    return cb(
      new Error("Only .jpg, .jpeg, .png, .gif files are allowed!"),
      false
    );
  }

  cb(null, true);
};

const upload = multer({
  storage: storage,
  //   limits: { fileSize: 1024 * 1024 }, // 1 MB size limit
  fileFilter: fileFilter, // Assigning the file filter function here
});

module.exports = upload;
