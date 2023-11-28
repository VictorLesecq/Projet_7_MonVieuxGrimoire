const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const sharp = require('../middleware/sharp-config');
const bookCtrl = require('../controllers/book');

router.get('/', bookCtrl.getAllBook);
router.get('/bestrating', bookCtrl.getBestRatings);
router.post('/', auth, multer, sharp, bookCtrl.createBook);

router.get('/:id', bookCtrl.getOneBook);
router.post('/:id/rating', auth, bookCtrl.rateBook);
router.delete('/:id', auth, bookCtrl.deleteBook);
router.put('/:id', auth, multer, sharp, bookCtrl.modifyBook);

module.exports = router;