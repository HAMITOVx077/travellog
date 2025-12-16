const Router = require('express');
const router = new Router();

//импорт роутеров
const authRouter = require('./authRouter');
const placeRouter = require('./placeRouter'); 
const journalRouter = require('./journalRouter');

//регистрация роутов:
router.use('/auth', authRouter); 
router.use('/places', placeRouter); // /api/places
router.use('/journal', journalRouter); // /api/journal

module.exports = router;