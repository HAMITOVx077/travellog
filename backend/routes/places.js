//подключаем необходимые библиотеки
const express = require('express');
const pool = require('../db');

//создаем роутер
const router = express.Router();

//Получить все места
//GET /api/places
router.get('/', async (req, res) => {
  try {
    //получаем все места из базы данных
    const result = await pool.query(
      `SELECT * FROM places ORDER BY created_at DESC`
    );

    res.json({
      message: 'Места успешно получены',
      places: result.rows
    });

  } catch (error) {
    console.error('Ошибка получения мест:', error);
    res.status(500).json({ 
      error: 'Ошибка сервера при получении мест' 
    });
  }
});

//Получить место по ID
//GET /api/places/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    //ищем место по ID
    const result = await pool.query(
      `SELECT * FROM places WHERE id = $1`,
      [id]
    );

    //проверяем найдено ли место
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        error: 'Место не найдено' 
      });
    }

    res.json({
      message: 'Место успешно получено',
      place: result.rows[0]
    });

  } catch (error) {
    console.error('Ошибка получения места:', error);
    res.status(500).json({ 
      error: 'Ошибка сервера при получении места' 
    });
  }
});


//Получить места по категории
//GET /api/places/category/:category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;

    const result = await pool.query(
      `SELECT * FROM places WHERE category = $1 ORDER BY name`,
      [category]
    );

    res.json({
      message: `Места категории "${category}" успешно получены`,
      places: result.rows
    });

  } catch (error) {
    console.error('Ошибка получения мест по категории:', error);
    res.status(500).json({ 
      error: 'Ошибка сервера при получении мест' 
    });
  }
});

//Поиск мест по названию
//GET /api/places/search/:query
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;

    const result = await pool.query(
      `SELECT * FROM places 
       WHERE name ILIKE $1 OR description ILIKE $1 
       ORDER BY name`,
      [`%${query}%`]
    );

    res.json({
      message: `Результаты поиска "${query}"`,
      places: result.rows
    });

  } catch (error) {
    console.error('Ошибка поиска мест:', error);
    res.status(500).json({ 
      error: 'Ошибка сервера при поиске' 
    });
  }
});

//экспортируем роутер
module.exports = router;