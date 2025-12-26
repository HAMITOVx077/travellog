const { User, Role } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator'); // Добавили для обработки ошибок
const { Op } = require('sequelize'); // Добавили для сложных запросов (проверка уникальности)

require('dotenv').config();

const generateJwt = (id, email, roleName, username, avatar_url) => {
    return jwt.sign(
        { id, email, role: roleName, username, avatar: avatar_url }, 
        process.env.SECRET_KEY,
        { expiresIn: '24h' }
    );
};

class UserController {
    // 1. РЕГИСТРАЦИЯ
    async registration(req, res) {
        try {
            // ПРОВЕРКА ОШИБОК ВАЛИДАЦИИ (из роутов)
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: errors.array()[0].msg });
            }

            const { username, email, password } = req.body;

            // ПРОВЕРКА УНИКАЛЬНОСТИ
            const candidateEmail = await User.findOne({ where: { email } });
            if (candidateEmail) {
                return res.status(400).json({ message: 'Пользователь с такой почтой уже существует.' });
            }

            const candidateName = await User.findOne({ where: { username } });
            if (candidateName) {
                return res.status(400).json({ message: 'Этот никнейм уже занят.' });
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

            const token = generateJwt(user.id, user.email, defaultRole.role_name, user.username);
            
            return res.json({ 
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    username: user.username,
                    role: defaultRole.role_name
                }
            });
        } catch (e) {
            res.status(500).json({ message: "Ошибка при регистрации" });
        }
    }

    // 2. ЛОГИН
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
        const token = generateJwt(user.id, user.email, roleName, user.username, user.avatar_url);
        
        return res.json({ 
            token,
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                role: roleName,
                avatar: user.avatar_url
            }
        });
    }

    // 3. ПРОВЕРКА (CHECK)
    async check(req, res) {
        // req.user берется из AuthMiddleware
        const user = await User.findByPk(req.user.id, {
            include: [{ model: Role, attributes: ['role_name'] }]
        });

        const token = generateJwt(user.id, user.email, user.Role.role_name, user.username, user.avatar_url);
        
        return res.json({ 
            token,
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                role: user.Role.role_name,
                avatar: user.avatar_url
            }
        });
    }

    // 4. ОБНОВЛЕНИЕ ПРОФИЛЯ
    async updateProfile(req, res) {
        try {
            // ПРОВЕРКА ОШИБОК ВАЛИДАЦИИ
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: errors.array()[0].msg });
            }

            const { username, email } = req.body;
            const userId = req.user.id;

            // ПРОВЕРКА УНИКАЛЬНОСТИ НИКА/ПОЧТЫ (если они меняются)
            if (username || email) {
                const existingUser = await User.findOne({
                    where: {
                        [Op.or]: [
                            username ? { username } : null,
                            email ? { email } : null
                        ].filter(Boolean),
                        id: { [Op.ne]: userId } // НЕ текущий пользователь
                    }
                });

                if (existingUser) {
                    const message = existingUser.email === email 
                        ? 'Эта почта уже занята другим пользователем' 
                        : 'Этот никнейм уже занят';
                    return res.status(400).json({ message });
                }
            }

            const user = await User.findByPk(userId, {
                include: [{ model: Role, attributes: ['role_name'] }]
            });

            if (!user) return res.status(404).json({ message: 'Пользователь не найден' });

            if (username) user.username = username;
            if (email) user.email = email;
            if (req.file) user.avatar_url = req.file.filename;

            await user.save();

            const token = generateJwt(user.id, user.email, user.Role.role_name, user.username, user.avatar_url);
            
            return res.json({ token });
        } catch (e) {
            console.error(e);
            res.status(500).json({ message: "Ошибка при обновлении профиля" });
        }
    }
}

module.exports = new UserController();