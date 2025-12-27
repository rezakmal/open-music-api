const multer = require('multer');

const InvariantError = require('../../exceptions/InvariantError');

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 512000, // 512KB
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new InvariantError('Images only'));
    }
    cb(null, true);
  }
});

module.exports = upload;
