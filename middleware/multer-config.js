const multer = require('multer');
const path =require('path');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp'
}

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images')
    },
    filename: (req, file, callback) => {
        const bookData = JSON.parse(req.body.book)
        const title = bookData.title.split(' ').join('_');
        const author = bookData.author.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, title + "_" + author + "_couverture"+ Date.now() + '.' + extension);
    }
});

module.exports = multer({ storage }).single('image');