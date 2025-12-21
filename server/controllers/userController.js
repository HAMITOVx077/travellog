const { User, Role } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

require('dotenv').config();

// 1. ОБНОВЛЕННАЯ ГЕНЕРАЦИЯ ТОКЕНА (добавили username в payload)
const generateJwt = (id, email, roleName, username) => {
    return jwt.sign(
        { id, email, role: roleName, username }, // Вшиваем username внутрь токена
        process.env.SECRET_KEY,
        { expiresIn: '24h' }
    );
};

class UserController {
    // 2. РЕГИСТРАЦИЯ
    async registration(req, res) {
        const { username, email, password } = req.body;
        if (!email || !password || !username) {
            return res.status(400).json({ message: 'Необходимо заполнить имя пользователя, email и пароль.' });
        }

        const candidate = await User.findOne({ where: { email } });
        if (candidate) {
            return res.status(400).json({ message: 'Пользователь с таким email уже существует.' });
        }

        const hashPassword = await bcrypt.hash(password, 5);
        const defaultRole = await Role.findOne({ where: { role_name: 'user' } });

        if (!defaultRole) {
            return res.status(500).json({ message: 'Не найдена базовая роль "user".' });
        }

        const user = await User.create({ 
            username, 
            email, 
            password_hash: hashPassword, 
            role_id: defaultRole.id 
        });

        // Генерируем токен с username
        const token = generateJwt(user.id, user.email, defaultRole.role_name, user.username);
        
        // Возвращаем и токен, и данные пользователя
        return res.json({ 
            token,
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                role: defaultRole.role_name
            }
        });
    }

    // 3. ЛОГИН
    async login(req, res) {
        const { email, password } = req.body;
        
        const user = await User.findOne({ 
            where: { email },
            include: [{ model: Role, attributes: ['role_name'] }]
        });
        
        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден.' });
        }

        const comparePassword = bcrypt.compareSync(password, user.password_hash);
        if (!comparePassword) {
            return res.status(403).json({ message: 'Указан неверный пароль.' });
        }

        const roleName = user.Role.role_name;
        
        // Генерируем токен с username
        const token = generateJwt(user.id, user.email, roleName, user.username);
        
        // Возвращаем объект user, чтобы фронтенд сразу его увидел
        return res.json({ 
            token,
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                role: roleName
            }
        });
    }

    // 4. ПРОВЕРКА (CHECK)
    async check(req, res) {
        // req.user берется из вашего AuthMiddleware. 
        // Убедитесь, что middleware также пробрасывает username после раскодировки токена.
        const token = generateJwt(req.user.id, req.user.email, req.user.role, req.user.username);
        
        return res.json({ 
            token,
            user: {
                id: req.user.id,
                email: req.user.email,
                username: req.user.username,
                role: req.user.role
            }
        });
    }
}

module.exports = new UserController();