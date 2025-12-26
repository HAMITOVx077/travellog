const { Place, UserPlace } = require('../models');

class PlaceController {
    
    //создание нового места в общем каталоге, доступно админу
    async createPlace(req, res, next) {
        try {
            const { name, description, country, city } = req.body;
            
            //если Multer успешно сохранил файл, имя будет в req.file.filename
            const fileName = req.file ? req.file.filename : null;

            if (!name || !country) {
                return res.status(400).json({ message: 'Необходимо указать название и страну места.' });
            }

            const place = await Place.create({ 
                name, 
                description, 
                country, 
                city, 
                image_url: fileName //сохраняем имя файла в БД
            });

            return res.json(place);
        } catch (e) {
            next(e);
        }
    }

    //получение списка всех мест из общего каталога для отображения на главной странице
    async getAll(req, res, next) {
        try {
            const places = await Place.findAll({ order: [['name', 'ASC']] });
            return res.json(places);
        } catch (e) { next(e); }
    }

    //добавление выбранного места в личный журнал пользователя (статус по умолчанию: хочу посетить)
    async addUserPlace(req, res) {
        const { placeId } = req.body;
        const userId = req.user.id;
        try {
            let userPlace = await UserPlace.findOne({ where: { user_id: userId, place_id: placeId } });
            if (userPlace) return res.status(400).json({ message: 'Уже в журнале' });
            
            userPlace = await UserPlace.create({ user_id: userId, place_id: placeId, status: 'want_to_visit' });
            
            const result = await UserPlace.findOne({
                where: { id: userPlace.id },
                include: [{ model: Place, attributes: ['name', 'country', 'city', 'image_url', 'id'] }]
            });
            return res.json(result);
        } catch (e) { res.status(500).json({ message: e.message }); }
    }

    //обновление личных данных места в журнале (изменение статуса, добавление отзыва, рейтинга и даты)
    async updateStatus(req, res) {
        const { id } = req.params;
        const { status, user_review, rating, visited_date } = req.body;
        try {
            let userPlace = await UserPlace.findOne({ where: { id: id, user_id: req.user.id } });
            if (!userPlace) return res.status(404).json({ message: 'Запись не найдена' });
            
            await userPlace.update({ status, user_review, rating, visited_date });
            
            const result = await UserPlace.findOne({
                where: { id: userPlace.id },
                include: [{ model: Place, attributes: ['name', 'country', 'city', 'image_url', 'id'] }]
            });
            return res.json(result);
        } catch (e) { res.status(500).json({ message: e.message }); }
    }

    //получение всех записей из личного журнала текущего авторизованного пользователя
    async getUserJournal(req, res) {
        try {
            const journal = await UserPlace.findAll({
                where: { user_id: req.user.id },
                include: [{ model: Place, attributes: ['name', 'country', 'city', 'image_url', 'id'] }],
                order: [['updatedAt', 'DESC']]
            });
            return res.json(journal);
        } catch (e) { res.status(500).json({ message: e.message }); }
    }

    //удаление конкретной записи из личного журнала пользователя
    async removeUserPlace(req, res) {
        try {
            await UserPlace.destroy({ where: { id: req.params.id, user_id: req.user.id } });
            return res.json({ message: 'Запись удалена' });
        } catch (e) { res.status(500).json({ message: e.message }); }
    }

    //полное удаление места из общей базы данных, доступно только админу
    async deletePlace(req, res) {
        try {
            const { id } = req.params; // Берем id из URL
            const place = await Place.findByPk(id);

            if (!place) {
                return res.status(404).json({ message: "Место не найдено в БД" });
            }

            await place.destroy();
            return res.json({ message: "Успешно удалено" });
        } catch (e) {
            res.status(500).json({ message: e.message });
        }
    }

    //редактирование информации о месте в общем каталоге (замена текста или фотографии)
    async updatePlace(req, res, next) {
        try {
            const { id } = req.params;
            const { name, description, country, city } = req.body;
            
            const place = await Place.findByPk(id);
            if (!place) {
                return res.status(404).json({ message: 'Место не найдено' });
            }

            //если загружено новое фото, берем его, иначе оставляем старое
            const fileName = req.file ? req.file.filename : place.image_url;

            await place.update({
                name: name || place.name,
                description: description || place.description,
                country: country || place.country,
                city: city || place.city,
                image_url: fileName
            });

            return res.json(place);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new PlaceController();