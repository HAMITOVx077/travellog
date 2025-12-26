const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function (req, res, next) {
    if (req.method === "OPTIONS") {
        return next();
    }

    try {
        //добавлена проверка на наличие заголовка
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: "Не авторизован. Заголовок отсутствует." });
        }

        const token = authHeader.split(' ')[1]; 
        if (!token) {
            return res.status(401).json({ message: "Не авторизован. Токен отсутствует." });
        }

        //верификация токена
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        
        //теперь req.user содержит { id, email, role, username }
        req.user = decoded; 
        
        next(); 
    } catch (e) {
        return res.status(401).json({ message: "Не авторизован. Сессия истекла или токен недействителен." });
    }
};