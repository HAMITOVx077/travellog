const express = require('express');
const cors = require('cors');
require('dotenv').config();

//Импортируем функцию подключения к БД
const { connectDB } = require('./config/db.config');
//Главный маршрутизатор API ---
const router = require('./routes/index'); 

const app = express();
const PORT = process.env.PORT || 5000;

//Middleware для обработки CORS
app.use(cors({
    origin: process.env.CLIENT_URL, //Разрешаем запросы только с клиента (React)
    credentials: true
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
    //устанавливаем соединение с БД и синхронизируем модели
    await connectDB(); 
    
    //запускаем Express-сервер
    app.listen(PORT, () => {
        console.log(`СЕРВЕР: Запущен на порту ${PORT}`);
        console.log(`URL: http://localhost:${PORT}`);
    });
};

//запускаем
start();