const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function (req, res, next) {
    //если запрос OPTIONS (preflight CORS-запрос), пропускаем его
    if (req.method === "OPTIONS") {
        return next();
    }

    try {
        //токен обычно приходит в виде: "Bearer ТОКЕН"
        const token = req.headers.authorization.split(' ')[1]; 
        
        if (!token) {
            return res.status(401).json({ message: "Не авторизован. Токен отсутствует." });
        }

        //верификация токена
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        
        //передаем данные пользователя (id, email, role) дальше в контроллер
        req.user = decoded; 
        
        //передаем управление следующему middleware или контроллеру
        next(); 
        
    } catch (e) {
        //если токен невалиден или просрочен
        return res.status(401).json({ message: "Не авторизован. Недействительный токен." });
    }
};