const multer = require('multer');

const storage = multer.memoryStorage();

const fileFilter = (req, file, callback) => {
    if (file.mimetype.startsWith('image/')) {
        callback(null, true);
    } else {
        callback(new Error('Invalid file type. Only images are allowed.'));
    }
};

module.exports = multer({ storage , fileFilter }).single('image');