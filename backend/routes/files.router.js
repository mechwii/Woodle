const express         = require('express');
const multer          = require('multer');
const path            = require('path');
const FileController = require('../controllers/files.controllers');

const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');

const storage    = multer.diskStorage({
  destination: UPLOAD_DIR,
  filename:    (_, file, cb) => cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '_'))
});
const upload = multer({ storage });

const router = express.Router();
router.get('/image/:mode/:name',        FileController.getImage);
router.delete('/image/:mode/:name',     FileController.deleteImage);
// router.post('/', upload.single('file'), FileController.uploadImage);

module.exports = router;
