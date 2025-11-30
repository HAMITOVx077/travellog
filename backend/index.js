//подключаем библиотеку Express для создания сервера
const express = require('express');

//подключаем CORS чтобы фронтенд мог общаться с бэкендом
const cors = require('cors');

//подключаем базу данных
const pool = require('./db');

//подключаем маршруты аутентификации
const authRoutes = require('./routes/auth');
//подключаем маршруты мест
const placesRoutes = require('./routes/places');
//подключаем маршруты личного журнала
const userPlacesRoutes = require('./routes/userPlaces');
//подключаем маршруты пользователей
const usersRoutes = require('./routes/users');

//сервер
const app = express();
//порт где будет работать сервер
const PORT = 5000;

//настраиваем middleware (промежуточное ПО)
app.use(cors()); //разрешаем запросы с других доменов
app.use(express.json()); //позволяем серверу понимать JSON

//подключаем маршруты аутентификации
app.use('/api/auth', authRoutes);
//подключаем маршруты мест
app.use('/api/places', placesRoutes);
//подключаем маршруты личного журнала
app.use('/api/user-places', userPlacesRoutes);
//подключаем маршруты пользователей
app.use('/api/users', usersRoutes);

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