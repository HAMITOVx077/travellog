const Router = require('express');
const router = new Router();
const placeController = require('../controllers/placeController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

//Маршруты для каталога (Place)

//POST /api/places - Создать новое место (ТОЛЬКО АДМИН)
//Сначала проверяем токен, затем проверяем роль
router.post('/', authMiddleware, roleMiddleware('admin'), placeController.createPlace);

//GET /api/places - Получить весь каталог мест (ДЛЯ ВСЕХ)
router.get('/', placeController.getAllPlaces);


//Маршруты для личного журнала (UserPlace)

//POST /api/places/journal - Добавить место в личный журнал (ТРЕБУЕТСЯ АВТОРИЗАЦИЯ)
router.post('/journal', authMiddleware, placeController.addUserPlace);

//PUT /api/places/journal - Обновить статус места (посетил, отзыв) (ТРЕБУЕТСЯ АВТОРИЗАЦИЯ)
router.put('/journal', authMiddleware, placeController.updateStatus);

//GET /api/places/journal - Получить личный журнал пользователя (ТРЕБУЕТСЯ АВТОРИЗАЦИЯ)
router.get('/journal', authMiddleware, placeController.getUserJournal);


module.exports = router;