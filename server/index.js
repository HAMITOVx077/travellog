const express = require('express');
const cors = require('cors'); // Используем библиотеку cors
require('dotenv').config();

//Импортируем функцию подключения к БД
const { connectDB } = require('./config/db.config');
//Главный маршрутизатор API
const router = require('./routes/index'); 
// Мы также должны убедиться, что модели импортируются, чтобы они синхронизировались
const models = require('./models'); 

const app = express();
const PORT = process.env.PORT || 5000;

//Middleware для обработки CORS
// Разрешаем запросы только с клиента (React)
// CLIENT_URL должен быть установлен в .env, например: CLIENT_URL=http://localhost:5173
app.use(cors({
    origin: process.env.CLIENT_URL, 
    credentials: true,
    // Разрешаем заголовок Authorization, который используется для передачи JWT-токена
    allowedHeaders: ['Content-Type', 'Authorization'], 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

//Middleware для обработки JSON-запросов
app.use(express.json());

//Подключение главного маршрутизатора API
//Все API-маршруты будут начинаться с /api
app.use('/api', router); 

//базовый тестовый маршрут
app.get('/', (req, res) => {
    res.status(200).json({ message: 'TravelLog API работает!' });
});

//функция запуска приложения
const start = async () => {
    try {
        //устанавливаем соединение с БД и синхронизируем модели
        await connectDB(); 
        
        //запускаем Express-сервер
        app.listen(PORT, () => {
            console.log(`СЕРВЕР: Запущен на порту ${PORT}`);
            console.log(`URL: http://localhost:${PORT}`);
        });
    } catch (e) {
        console.error('Ошибка при запуске сервера:', e.message);
        process.exit(1); // Выход из процесса при ошибке
    }
};

//запускаем
start();