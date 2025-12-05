const { User, Role, sequelize } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

require('dotenv').config();

//генерация JWT-токена
const generateJwt = (id, email, roleName) => {
    //в payload токена включаем только ключевую информацию
    return jwt.sign(
        { id, email, role: roleName },
        process.env.SECRET_KEY,
        { expiresIn: '24h' } // Токен будет действителен 24 часа
    );
};

//регистрация Пользователя ---
class UserController {
    async registration(req, res) {
        //получение и проверка данных
        const { username, email, password } = req.body;
        if (!email || !password || !username) {
            return res.status(400).json({ message: 'Необходимо заполнить имя пользователя, email и пароль.' });
        }

        //проверка существования пользователя
        const candidate = await User.findOne({ where: { email } });
        if (candidate) {
            return res.status(400).json({ message: 'Пользователь с таким email уже существует.' });
        }

        //хэширование пароля и получение ID роли 'user'
        const hashPassword = await bcrypt.hash(password, 5); //5 - это сложность хэширования (salt)
        const defaultRole = await Role.findOne({ where: { role_name: 'user' } });

        if (!defaultRole) {
             return res.status(500).json({ message: 'Не найдена базовая роль "user".' });
        }

        //создание пользователя в БД
        const user = await User.create({ 
            username, 
            email, 
            password_hash: hashPassword, 
            role_id: defaultRole.id //присваиваем ID роли 'user'
        });

        //генерация и отправка токена
        const token = generateJwt(user.id, user.email, defaultRole.role_name);
        return res.json({ token });
    }

    //авторизация Пользователя
    async login(req, res) {
        const { email, password } = req.body;
        
        //находим пользователя по email
        //используем метод include, чтобы сразу получить связанную роль
        const user = await User.findOne({ 
            where: { email },
            include: [{ model: Role, attributes: ['role_name'] }]
        });
        
        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден.' });
        }

        //сравнение хэшей паролей
        const comparePassword = bcrypt.compareSync(password, user.password_hash);
        if (!comparePassword) {
            return res.status(403).json({ message: 'Указан неверный пароль.' });
        }

        //генерация и отправка токена
        const roleName = user.Role.role_name; //получаем имя роли из связанной модели
        const token = generateJwt(user.id, user.email, roleName);
        return res.json({ token });
    }

    //это маршрут для проверки, что токен пользователя все еще действителен
    async check(req, res) {
        //если код дошел до этой функции, значит Middleware успешно проверил токен.
        //генерируем новый токен, чтобы обновить время его жизни.
        const token = generateJwt(req.user.id, req.user.email, req.user.role);
        return res.json({ token });
    }
}

module.exports = new UserController();