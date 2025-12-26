const { User, Role } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');

require('dotenv').config();

//функция для создания JWT-токена
const generateJwt = (id, email, roleName, username, avatar_url) => {
    return jwt.sign(
        { id, email, role: roleName, username, avatar: avatar_url }, 
        process.env.SECRET_KEY,
        { expiresIn: '24h' }
    );
};

class UserController {
    
    //регистрация нового пользователя: проверка данных, хэширование пароля и создание записи в БД
    async registration(req, res) {
        try {
            //проверка на ошибки валидации, пришедшие из middleware в роутах
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: errors.array()[0].msg });
            }

            const { username, email, password } = req.body;

            //проверка, не занята ли почта другим пользователем
            const candidateEmail = await User.findOne({ where: { email } });
            if (candidateEmail) {
                return res.status(400).json({ message: 'Пользователь с такой почтой уже существует.' });
            }

            //проверка, не занят ли никнейм другим пользователем
            const candidateName = await User.findOne({ where: { username } });
            if (candidateName) {
                return res.status(400).json({ message: 'Этот никнейм уже занят.' });
            }

            //шифрование пароля перед сохранением в базу
            const hashPassword = await bcrypt.hash(password, 5);
            
            //присвоение базовой роли новому аккаунту
            const defaultRole = await Role.findOne({ where: { role_name: 'user' } });

            if (!defaultRole) {
                return res.status(500).json({ message: 'Не найдена базовая роль "user".' });
            }

            //создание записи пользователя в базе данных
            const user = await User.create({ 
                username, 
                email, 
                password_hash: hashPassword, 
                role_id: defaultRole.id 
            });

            //генерация токена, чтобы пользователь сразу стал авторизованным после регистрации
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

    //авторизация: проверка почты и сравнение хэша пароля
    async login(req, res) {
        const { email, password } = req.body;
        
        //поиск пользователя и подгрузка его роли
        const user = await User.findOne({ 
            where: { email },
            include: [{ model: Role, attributes: ['role_name'] }]
        });
        
        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден.' });
        }

        //сравнение введенного пароля с зашифрованным паролем из базы
        const comparePassword = bcrypt.compareSync(password, user.password_hash);
        if (!comparePassword) {
            return res.status(403).json({ message: 'Указан неверный пароль.' });
        }

        const roleName = user.Role.role_name;
        //выдача нового токена при успешном входе
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

    //проверка авторизации: вызывается при перезагрузке страницы для обновления токена
    async check(req, res) {
        //ID пользователя берется из расшифрованного токена в authMiddleware
        const user = await User.findByPk(req.user.id, {
            include: [{ model: Role, attributes: ['role_name'] }]
        });

        //генерация свежего токена (продление сессии)
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

    //обновление личных данных профиля (никнейм, почта, аватар)
    async updateProfile(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: errors.array()[0].msg });
            }

            const { username, email } = req.body;
            const userId = req.user.id;

            //проверка: если пользователь меняет почту или ник, они не должны быть заняты другими
            if (username || email) {
                const existingUser = await User.findOne({
                    where: {
                        [Op.or]: [
                            username ? { username } : null,
                            email ? { email } : null
                        ].filter(Boolean),
                        id: { [Op.ne]: userId } //исключаем самого себя из поиска дубликатов
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

            //обновляем поля, если они были присланы в запросе
            if (username) user.username = username;
            if (email) user.email = email;
            //если была загружена новая аватарка через Multer
            if (req.file) user.avatar_url = req.file.filename;

            await user.save();

            //создаем новый токен с обновленными данными (например, новым именем)
            const token = generateJwt(user.id, user.email, user.Role.role_name, user.username, user.avatar_url);
            
            return res.json({ token });
        } catch (e) {
            console.error(e);
            res.status(500).json({ message: "Ошибка при обновлении профиля" });
        }
    }
}

module.exports = new UserController();