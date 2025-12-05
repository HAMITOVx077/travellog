const jwt = require('jsonwebtoken');
require('dotenv').config();

//эта функция-фабрика принимает необходимую роль (например admin)
module.exports = function (requiredRole) {
    return function (req, res, next) {
        if (req.method === "OPTIONS") {
            return next();
        }

        try {
            //данные пользователя уже должны быть в req.user после authMiddleware
            const token = req.headers.authorization.split(' ')[1];
            
            if (!token) {
                return res.status(401).json({ message: "Не авторизован." });
            }

            //декодируем токен (мы делаем это здесь, чтобы получить роль)
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            
            //проверяем, совпадает ли роль пользователя с требуемой
            if (decoded.role !== requiredRole) {
                return res.status(403).json({ message: "Нет доступа. Требуется роль: " + requiredRole });
            }
            
            req.user = decoded; //передаем данные дальше
            next();

        } catch (e) {
            return res.status(401).json({ message: "Не авторизован." });
        }
    };
};