const Router = require('express');
const router = new Router();
const placeController = require('../controllers/placeController');
const multer = require('multer');
const path = require('path');
const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware'); 

const storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, 'static/'); },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

//мАРШРУТЫ
router.get('/', placeController.getAll);
router.post('/', authMiddleware, checkRole('admin'), upload.single('image'), placeController.createPlace);
//добавлен роут для обновления
router.put('/:id', authMiddleware, checkRole('admin'), upload.single('image'), placeController.updatePlace);
router.delete('/:id', authMiddleware, checkRole('admin'), placeController.deletePlace);

module.exports = router;