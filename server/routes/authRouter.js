const Router = require('express');
const router = new Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const { body } = require('express-validator');
const multer = require('multer');
const path = require('path');

//настройка хранилища для Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'static/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

//общая логика проверки доменов
const domainCheck = (value) => {
    const allowedDomains = ['@gmail.com', '@mail.ru', '@yandex.ru', '@bk.ru', '@list.ru'];
    if (!allowedDomains.some(domain => value.endsWith(domain))) {
        throw new Error('Разрешены только почты: gmail.com, mail.ru, yandex.ru, bk.ru, list.ru');
    }
    return true;
};

//правила валидации для регистрации
const registrationValidation = [
    body('email')
        .isEmail().withMessage('Некорректный формат почты')
        .custom(domainCheck),
    body('password')
        .isLength({ min: 6 }).withMessage('Пароль должен быть не менее 6 символов'),
    body('username')
        .trim()
        .isLength({ min: 3 }).withMessage('Никнейм должен быть не менее 3 символов')
];

//правила валидации при обновлении профиля
const updateValidation = [
    body('email')
        .optional({ checkFalsy: true })
        .isEmail().withMessage('Некорректный формат почты')
        .custom(domainCheck),
    body('username')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ min: 3 }).withMessage('Никнейм должен быть не менее 3 символов')
];

//роуты

//регистрация
router.post('/registration', registrationValidation, userController.registration);

//логин
router.post('/login', userController.login);

//проверка авторизации (AuthMiddleware вытаскивает данные из токена)
router.get('/check', authMiddleware, userController.check);

//обновление профиля
//сначала Middleware авторизации, затем загрузка фото, затем валидация полей
router.patch(
    '/update-profile', 
    authMiddleware, 
    upload.single('avatar'), 
    updateValidation, 
    userController.updateProfile
);

module.exports = router;