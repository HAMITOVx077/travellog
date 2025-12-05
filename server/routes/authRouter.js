const Router = require('express');
const router = new Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware'); 

//POST /api/auth/registration
router.post('/registration', userController.registration);

//POST /api/auth/login
router.post('/login', userController.login);

//GET /api/auth/check
router.get('/check', authMiddleware, userController.check); 

module.exports = router;