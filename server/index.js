const express = require('express'); //импортируем фреймворк Express для создания сервера
const cors = require('cors'); //импортируем CORS для разрешения запросов с фронтенда
const path = require('path'); //библиотека для работы с путями файлов
require('dotenv').config(); //загружаем переменные окружения из файла .env

const { connectDB } = require('./config/db.config'); //импортируем функцию подключения к базе данных
const router = require('./routes/index'); //импортируем главный роутер, который объединяет все пути
const models = require('./models'); //импортируем модели

const app = express();
const PORT = process.env.PORT || 5000;

//настройка CORS
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
}));

app.use(express.json());

app.use(express.static(path.resolve(__dirname, 'static')));

app.use('/api', router);//подключаем все наши маршруты с префиксом /api

//тестовый маршрут, чтобы проверить, запущен ли сервер в браузере
app.get('/', (req, res) => {
    res.status(200).json({ message: 'TravelLog API работает!' });
});

//главная функция для запуска сервера
const start = async () => {
    try {
        await connectDB(); //подключение к бд
        app.listen(PORT, () => {
            console.log(`СЕРВЕР: Запущен на порту ${PORT}`);
        });
    } catch (e) {
        console.error('Ошибка при запуске сервера:', e.message);
        process.exit(1);
    }
};

start();