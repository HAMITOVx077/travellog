const Router = require('express');
const router = new Router();
const placeController = require('../controllers/placeController');
const multer = require('multer');
const path = require('path');

//настройка хранилища
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'static/'); //папка должна существовать!
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

//используем upload.single('image') для обработки файла
router.post('/', upload.single('image'), placeController.createPlace);
router.get('/', placeController.getAll);

module.exports = router;