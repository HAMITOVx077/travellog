const Router = require('express');
const router = new Router();

//импорт дочерних роутеров для разных сущностей
const authRouter = require('./authRouter');
const placeRouter = require('./placeRouter'); 
const journalRouter = require('./journalRouter');

//связываем префикс адреса с конкретным роутером
router.use('/auth', authRouter);
router.use('/places', placeRouter);
router.use('/journal', journalRouter);

module.exports = router;