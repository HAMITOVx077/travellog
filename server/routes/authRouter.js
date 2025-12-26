const Router = require('express');
const router = new Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const { body } = require('express-validator');
const multer = require('multer');
const path = require('path');

// Настройка хранилища для Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'static/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Общая логика проверки доменов (вынесена для удобства)
const domainCheck = (value) => {
    const allowedDomains = ['@gmail.com', '@mail.ru', '@yandex.ru', '@bk.ru', '@list.ru'];
    if (!allowedDomains.some(domain => value.endsWith(domain))) {
        throw new Error('Разрешены только почты: gmail.com, mail.ru, yandex.ru, bk.ru, list.ru');
    }
    return true;
};

// Правила валидации для РЕГИСТРАЦИИ
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

// Правила валидации для ОБНОВЛЕНИЯ (используем .optional())
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

// Регистрация
router.post('/registration', registrationValidation, userController.registration);

// Логин
router.post('/login', userController.login);

// Проверка авторизации (AuthMiddleware вытаскивает данные из токена)
router.get('/check', authMiddleware, userController.check);

// Обновление профиля (PATCH)
// Порядок важен: сначала Middleware авторизации, затем загрузка фото, затем валидация полей
router.patch(
    '/update-profile', 
    authMiddleware, 
    upload.single('avatar'), 
    updateValidation, 
    userController.updateProfile
);

module.exports = router;