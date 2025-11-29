//подключаем библиотеку Express для создания сервера
const express = require('express');
//подключаем CORS чтобы фронтенд мог общаться с бэкендом
const cors = require('cors');

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

//запускаем сервер
app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});