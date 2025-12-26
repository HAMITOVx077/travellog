const Router = require('express');
const router = new Router();
const placeController = require('../controllers/placeController');
const authMiddleware = require('../middleware/authMiddleware');

//получить журнал
router.get('/', authMiddleware, placeController.getUserJournal); 
//добавить место
router.post('/', authMiddleware, placeController.addUserPlace);
//обновить статус
router.put('/:id', authMiddleware, placeController.updateStatus);
//удалить из журнала
router.delete('/:id', authMiddleware, placeController.removeUserPlace); 

module.exports = router;