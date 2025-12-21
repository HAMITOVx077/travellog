const Router = require('express');
const router = new Router();
const placeController = require('../controllers/placeController');
const multer = require('multer');
const path = require('path');

const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware'); 

// настройка хранилища
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'static/'); 
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

//маршруты
router.post('/', upload.single('image'), placeController.createPlace);
router.get('/', placeController.getAll);

router.delete('/:id', authMiddleware, checkRole('admin'), placeController.deletePlace);

module.exports = router;