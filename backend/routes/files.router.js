const express         = require('express');
const multer          = require('multer');
const path            = require('path');
const FileController = require('../controllers/files.controllers');

const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');

const storage    = multer.diskStorage({
  destination: UPLOAD_DIR,
  filename:    (_, file, cb) => cb(null,file.originalname)
});
const upload = multer({ storage });

const router = express.Router();
router.get('/image/:mode/:name',        FileController.getImage);
router.get('/image-data/:mode/:name',        FileController.getImageMetadata);

router.delete('/image/:mode/:name',     FileController.deleteImage);
router.post('/image/:mode', upload.single('file'), FileController.uploadImage);

// Utilise cette route pour upload un file avec :code qui est le code l'UE -> te renvoie les metadatas
router.get('/get-files/:code/:name',         FileController.getCourseFile);
router.post('/add-files/:code', upload.single('file'), FileController.uploadCourseFile);



// router.post('/', upload.single('file'), FileController.uploadImage);

module.exports = router;
