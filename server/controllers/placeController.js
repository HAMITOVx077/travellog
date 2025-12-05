const { Place, UserPlace, User, Role } = require('../models');
const { Sequelize } = require('sequelize');

class PlaceController {
    //админ логика - управление Каталогом (Place)

    //создание нового места в общем каталоге (ТОЛЬКО ДЛЯ ADMIN)
    async createPlace(req, res) {
        const { name, description, country, city, image_url } = req.body;

        if (!name || !country) {
            return res.status(400).json({ message: 'Необходимо указать название и страну места.' });
        }

        try {
            const place = await Place.create({ name, description, country, city, image_url });
            return res.json(place);
        } catch (e) {
            return res.status(500).json({ message: 'Ошибка при создании места: ' + e.message });
        }
    }

    //получение всего общего каталога мест (ДЛЯ ВСЕХ)
    async getAllPlaces(req, res) {
        try {
            const places = await Place.findAll({
                order: [['name', 'ASC']]
            });
            return res.json(places);
        } catch (e) {
            return res.status(500).json({ message: 'Ошибка при получении каталога.' });
        }
    }

    //юзер логика - управление Журналом (UserPlace)

    //добавить место в личный журнал ('want_to_visit') (для юзера)
    async addUserPlace(req, res) {
        const { placeId } = req.body;
        const userId = req.user.id; //Берем ID из токена

        if (!placeId) {
            return res.status(400).json({ message: 'Не указан ID места.' });
        }
        
        try {
            //проверяем, существует ли уже такая запись 
            let userPlace = await UserPlace.findOne({ where: { user_id: userId, place_id: placeId } });
            
            if (userPlace) {
                 return res.status(400).json({ message: 'Это место уже есть в вашем журнале.' });
            }

            //создаем новую запись со статусом 'want_to_visit'
            userPlace = await UserPlace.create({ user_id: userId, place_id: placeId, status: 'want_to_visit' });

            return res.json(userPlace);
        } catch (e) {
            return res.status(500).json({ message: 'Ошибка при добавлении места в журнал: ' + e.message });
        }
    }
    
    //Обновить статус места (посетил + добавить отзыв/оценку) (ДЛЯ USER)
    async updateStatus(req, res) {
        const { placeId, status, userReview, rating, visitedDate } = req.body;
        const userId = req.user.id;

        if (!placeId || !status) {
            return res.status(400).json({ message: 'Не указан ID места или новый статус.' });
        }

        try {
            let userPlace = await UserPlace.findOne({ where: { user_id: userId, place_id: placeId } });

            if (!userPlace) {
                return res.status(404).json({ message: 'Запись об этом месте не найдена в вашем журнале.' });
            }

            if (status === 'visited') {
                //Валидация для статуса 'visited'
                if (!userReview || !rating || !visitedDate) {
                    return res.status(400).json({ message: 'Для статуса "visited" необходимы отзыв, оценка и дата посещения.' });
                }
                if (rating < 1 || rating > 5) {
                    return res.status(400).json({ message: 'Оценка должна быть от 1 до 5.' });
                }
                
                //Обновляем все поля
                userPlace.status = 'visited';
                userPlace.user_review = userReview;
                userPlace.rating = rating;
                userPlace.visited_date = visitedDate;
            } else if (status === 'want_to_visit') {
                 // Можно обновить обратно
                 userPlace.status = 'want_to_visit';
                 userPlace.user_review = null;
                 userPlace.rating = null;
                 userPlace.visited_date = null;
            } else {
                 return res.status(400).json({ message: 'Недопустимый статус.' });
            }

            await userPlace.save();
            return res.json(userPlace);

        } catch (e) {
            return res.status(500).json({ message: 'Ошибка при обновлении статуса: ' + e.message });
        }
    }
    
    //получить личный журнал пользователя (ДЛЯ USER)
    async getUserJournal(req, res) {
        const userId = req.user.id;
        const { status } = req.query; //фильтр по статусу

        let whereCondition = { user_id: userId };
        if (status) {
            whereCondition.status = status;
        }

        try {
            //используем JOIN (include) для получения данных о месте 
            const journal = await UserPlace.findAll({
                where: whereCondition,
                include: [{ 
                    model: Place, //берем связанные данные из Place
                    attributes: ['name', 'country', 'city', 'image_url'] 
                }],
                order: [['updatedAt', 'DESC']]
            });
            
            return res.json(journal);
            
        } catch (e) {
            return res.status(500).json({ message: 'Ошибка при получении журнала: ' + e.message });
        }
    }
}

module.exports = new PlaceController();