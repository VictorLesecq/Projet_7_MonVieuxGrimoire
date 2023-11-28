const sharp = require('sharp');

const resizeMiddleware =  async (req, res, next) => {
    // check if a file is send in the request 
    if (!req.file){
        return next();
    };
    
    try {        
        const bookData = JSON.parse(req.body.book);
        const title = bookData.title.split(' ').join('_'); 
        const author = bookData.author.split(' ').join('_');
        const newPath = "images/" + title + "_" + author + "_couverture"+ Date.now() + '.webp';

        await sharp(req.file.buffer)
        .resize(300 , null)
        .webp()
        .toFile(newPath)

        req.file.path = newPath;

    } catch(error) {
        res.status(500).json({ error });
    }
    next();
};

module.exports = resizeMiddleware;