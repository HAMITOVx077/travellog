const Router = require('express');
const router = new Router();
const authRouter = require('./authRouter');
const placeRouter = require('./placeRouter');

//базовый префикс для всех маршрутов API
router.use('/auth', authRouter);
router.use('/places', placeRouter);

module.exports = router;