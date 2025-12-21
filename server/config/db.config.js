const { Sequelize } = require('sequelize');
require('dotenv').config(); 

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

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('УСПЕХ: Соединение с PostgreSQL установлено.');
        
        const db = require('../models'); 
        
        await sequelize.sync({ alter: true }); 
        console.log('УСПЕХ: Все модели синхронизированы (база обновлена).');

    } catch (error) {
        console.error('ОШИБКА: Не удалось подключиться или синхронизировать БД:', error.message);
    }
};

module.exports = { sequelize, connectDB };