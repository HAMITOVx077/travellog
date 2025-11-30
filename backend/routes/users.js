//подключаем необходимые библиотеки
const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../db');

//создаем роутер
const router = express.Router();

//Получить данные пользователя
//GET /api/users/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT id, username, email, created_at 
       FROM users WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        error: 'Пользователь не найден' 
      });
    }

    res.json({
      message: 'Данные пользователя успешно получены',
      user: result.rows[0]
    });

  } catch (error) {
    console.error('Ошибка получения пользователя:', error);
    res.status(500).json({ 
      error: 'Ошибка сервера при получении пользователя' 
    });
  }
});

//Обновить данные пользователя
//PUT /api/users/:id
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email } = req.body;

    //проверяем обязательные поля
    if (!username || !email) {
      return res.status(400).json({ 
        error: 'Имя пользователя и email обязательны' 
      });
    }

    const result = await pool.query(
      `UPDATE users 
       SET username = $1, email = $2 
       WHERE id = $3 
       RETURNING id, username, email, created_at`,
      [username, email, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        error: 'Пользователь не найден' 
      });
    }

    res.json({
      message: 'Данные пользователя успешно обновлены',
      user: result.rows[0]
    });

  } catch (error) {
    console.error('Ошибка обновления пользователя:', error);
    
    if (error.code === '23505') {
      return res.status(400).json({ 
        error: 'Пользователь с таким email или username уже существует' 
      });
    }

    res.status(500).json({ 
      error: 'Ошибка сервера при обновлении пользователя' 
    });
  }
});

//экспортируем роутер
module.exports = router;