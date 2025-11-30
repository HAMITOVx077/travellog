//подключаем необходимые библиотеки
const express = require('express');
const pool = require('../db');

//создаем роутер
const router = express.Router();

//Добавить место в личный журнал
//POST /api/user-places
router.post('/', async (req, res) => {
  try {
    const { user_id, place_id, status } = req.body;

    //проверяем обязательные поля
    if (!user_id || !place_id || !status) {
      return res.status(400).json({ 
        error: 'Все поля обязательны' 
      });
    }

    //проверяем валидность статуса
    if (!['want_to_visit', 'visited'].includes(status)) {
      return res.status(400).json({ 
        error: 'Статус должен быть: want_to_visit или visited' 
      });
    }

    //добавляем место в журнал пользователя
    const result = await pool.query(
      `INSERT INTO user_places (user_id, place_id, status) 
       VALUES ($1, $2, $3) 
       RETURNING *`,
      [user_id, place_id, status]
    );

    res.status(201).json({
      message: 'Место успешно добавлено в журнал',
      userPlace: result.rows[0]
    });

  } catch (error) {
    console.error('Ошибка добавления места в журнал:', error);
    
    //обрабатываем ошибку дублирования
    if (error.code === '23505') {
      return res.status(400).json({ 
        error: 'Это место уже есть в вашем журнале' 
      });
    }

    res.status(500).json({ 
      error: 'Ошибка сервера при добавлении места' 
    });
  }
});

//Получить журнал пользователя
//GET /api/user-places/:user_id
router.get('/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;

    //получаем все места пользователя с информацией о местах
    const result = await pool.query(
      `SELECT up.*, p.name, p.description, p.country, p.city
       FROM user_places up
       JOIN places p ON up.place_id = p.id
       WHERE up.user_id = $1
       ORDER BY up.created_at DESC`,
      [user_id]
    );

    res.json({
      message: 'Журнал пользователя успешно получен',
      userPlaces: result.rows
    });

  } catch (error) {
    console.error('Ошибка получения журнала:', error);
    res.status(500).json({ 
      error: 'Ошибка сервера при получении журнала' 
    });
  }
});

//Обновить статус места в журнале
//PUT /api/user-places/:id

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, user_review, visited_date } = req.body;

    //проверяем что статус валидный
    if (status && !['want_to_visit', 'visited'].includes(status)) {
      return res.status(400).json({ 
        error: 'Статус должен быть: want_to_visit или visited' 
      });
    }

    //обновляем запись в журнале
    const result = await pool.query(
      `UPDATE user_places 
       SET status = COALESCE($1, status),
           user_review = COALESCE($2, user_review),
           visited_date = COALESCE($3, visited_date)
       WHERE id = $4
       RETURNING *`,
      [status, user_review, visited_date, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        error: 'Запись в журнале не найдена' 
      });
    }

    res.json({
      message: 'Журнал успешно обновлен',
      userPlace: result.rows[0]
    });

  } catch (error) {
    console.error('Ошибка обновления журнала:', error);
    res.status(500).json({ 
      error: 'Ошибка сервера при обновлении журнала' 
    });
  }
});

//Удалить место из журнала
//DELETE /api/user-places/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `DELETE FROM user_places WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        error: 'Запись в журнале не найдена' 
      });
    }

    res.json({
      message: 'Место успешно удалено из журнала',
      deletedUserPlace: result.rows[0]
    });

  } catch (error) {
    console.error('Ошибка удаления из журнала:', error);
    res.status(500).json({ 
      error: 'Ошибка сервера при удалении' 
    });
  }
});

//Получить статистику пользователя
//GET /api/user-places/:user_id/stats
router.get('/:user_id/stats', async (req, res) => {
  try {
    const { user_id } = req.params;

    const statsResult = await pool.query(
      `SELECT 
        COUNT(*) as total_places,
        COUNT(CASE WHEN status = 'visited' THEN 1 END) as visited_count,
        COUNT(CASE WHEN status = 'want_to_visit' THEN 1 END) as want_to_visit_count
       FROM user_places 
       WHERE user_id = $1`,
      [user_id]
    );

    const countriesResult = await pool.query(
      `SELECT DISTINCT p.country
       FROM user_places up
       JOIN places p ON up.place_id = p.id
       WHERE up.user_id = $1 AND up.status = 'visited'`,
      [user_id]
    );

    res.json({
      message: 'Статистика пользователя успешно получена',
      stats: {
        ...statsResult.rows[0],
        visited_countries: countriesResult.rows.map(row => row.country)
      }
    });

  } catch (error) {
    console.error('Ошибка получения статистики:', error);
    res.status(500).json({ 
      error: 'Ошибка сервера при получении статистики' 
    });
  }
});

//экспортируем роутер
module.exports = router;