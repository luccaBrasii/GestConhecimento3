const multer = require("multer");

const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/upload'));
  },
  filename: function (req, file, cb) {
    const time = Date.now()
    cb(null, `${time}_${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage: storage });

module.exports = upload;