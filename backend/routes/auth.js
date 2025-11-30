//подключаем необходимые библиотеки
const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../db');

//создаем роутер
const router = express.Router();

//Регистрация нового пользователя
//POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    //получаем данные из запроса
    const { username, email, password } = req.body;

    //проверяем обязательные поля
    if (!username || !email || !password) {
      return res.status(400).json({ 
        error: 'Все поля обязательны для заполнения' 
      });
    }

    //проверяем длину пароля
    if (password.length < 6) {
      return res.status(400).json({ 
        error: 'Пароль должен быть не менее 6 символов' 
      });
    }

    //хэшируем пароль для безопасности
    const hashedPassword = await bcrypt.hash(password, 10);

    //создаем пользователя в базе данных
    const result = await pool.query(
      `INSERT INTO users (username, email, password_hash, role_id) 
       VALUES ($1, $2, $3, (SELECT id FROM roles WHERE role_name = 'user')) 
       RETURNING id, username, email, created_at`,
      [username, email, hashedPassword]
    );

    //возвращаем успешный ответ
    res.status(201).json({
      message: 'Пользователь успешно зарегистрирован',
      user: result.rows[0]
    });

  } catch (error) {
    console.error('Ошибка регистрации:', error);
    
    //обрабатываем ошибки уникальности
    if (error.code === '23505') {
      return res.status(400).json({ 
        error: 'Пользователь с таким email или username уже существует' 
      });
    }

    res.status(500).json({ 
      error: 'Ошибка сервера при регистрации' 
    });
  }
});

//Аутентификация пользователя (логин)
//POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    //получаем данные из запроса
    const { email, password } = req.body;

    //проверяем обязательные поля
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email и пароль обязательны' 
      });
    }

    //ищем пользователя в базе данных
    const userResult = await pool.query(
      `SELECT users.*, roles.role_name 
       FROM users 
       JOIN roles ON users.role_id = roles.id 
       WHERE email = $1`,
      [email]
    );

    //проверяем существует ли пользователь
    if (userResult.rows.length === 0) {
      return res.status(401).json({ 
        error: 'Неверный email или пароль' 
      });
    }

    const user = userResult.rows[0];

    //проверяем пароль
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    
    if (!isPasswordValid) {
      return res.status(401).json({ 
        error: 'Неверный email или пароль' 
      });
    }

    //успешный логин - возвращаем данные пользователя (без пароля)
    const { password_hash, ...userWithoutPassword } = user;
    
    res.json({
      message: 'Успешный вход в систему',
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Ошибка входа:', error);
    res.status(500).json({ 
      error: 'Ошибка сервера при входе' 
    });
  }
});

//экспортируем роутер
module.exports = router;