//подключаем библиотеку для работы с PostgreSQL
const { Pool } = require('pg');

//создаем подключение к базе данных
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'travellog',
  password: '12344321',
  port: 5432,
});

//проверяем подключение
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Ошибка подключения к БД:', err.message);
  } else {
    console.log('Успешное подключение к PostgreSQL');
    console.log('Время сервера БД:', res.rows[0].now);
  }
});

//экспортируем pool чтобы использовать в других файлах
module.exports = pool;