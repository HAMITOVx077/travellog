const express = require('express');
const cors = require('cors');
const path = require('path'); //добавили
require('dotenv').config();

const { connectDB } = require('./config/db.config');
const router = require('./routes/index'); 
const models = require('./models'); 

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: process.env.CLIENT_URL, 
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'], 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

app.use(express.json());

//разрешаем доступ к папке со статикой
app.use(express.static(path.resolve(__dirname, 'static')));

app.use('/api', router); 

app.get('/', (req, res) => {
    res.status(200).json({ message: 'TravelLog API работает!' });
});

const start = async () => {
    try {
        await connectDB(); 
        app.listen(PORT, () => {
            console.log(`СЕРВЕР: Запущен на порту ${PORT}`);
        });
    } catch (e) {
        console.error('Ошибка при запуске сервера:', e.message);
        process.exit(1);
    }
};

start();