const { Sequelize } = require('sequelize');
require('dotenv').config(); 

//создаем экземпляр Sequelize
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'postgres',
        logging: false 
    }
);

//функция для тестирования подключения и синхронизации
const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('УСПЕХ: Соединение с PostgreSQL установлено.');
        
        //импортируем все модели (это также инициализирует связи в index.js)
        const db = require('../models'); 
        
        //синхронизация моделей с базой данных (создание таблиц, если их нет)
        await sequelize.sync({ force: false }); 
        console.log('УСПЕХ: Все модели синхронизированы.');

    } catch (error) {
        console.error('ОШИБКА: Не удалось подключиться или синхронизировать БД:', error.message);
    }
};

module.exports = { sequelize, connectDB };