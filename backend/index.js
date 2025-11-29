//подключаем библиотеку Express для создания сервера
const express = require('express');

//подключаем CORS чтобы фронтенд мог общаться с бэкендом
const cors = require('cors');

//подключаем базу данных
const pool = require('./db');

//сервер
const app = express();
//порт где будет работать сервер
const PORT = 5000;

//настраиваем middleware (промежуточное ПО)
app.use(cors()); //разрешаем запросы с других доменов
app.use(express.json()); //позволяем серверу понимать JSON

//создаем главный маршрут, когда заходят на главную страницу
app.get('/', (req, res) => {
  res.json({ 
    message: 'TravelLog API работает',
    student: 'Хамитов Айнур Ильгизович',
    project: 'TravelLog - журнал путешествий',
    version: '0.1.0'
  });
});

//добавляем новый маршрут для проверки БД
app.get('/api/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW() as current_time');
    res.json({ 
      message: 'База данных подключена успешно!',
      currentTime: result.rows[0].current_time
    });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка подключения к БД' });
  }
});

//запускаем сервер
app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});