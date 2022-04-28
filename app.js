//     Первая импортирует Express в проект, чтобы его можно было использовать. При каждом добавлении в проект пакета необходимо импортировать его туда, где он будет использоваться.
// Вторая строка вызывает функцию express, которая создает новое приложение, после чего присваивает результат константе app.


require("./db") // подключение к db
const morgan = require("morgan");
const express = require('express') // импортируем модуль express
require('dotenv').config() // Имппорт файла .env и настройка
const app = express() // экспресс приложение запуск
const postRouter = require('./routers/post') //  импорт файла маршрутов
const PORT = process.env.PORT // получение порта 
const cors = require('cors');
app.use(cors({}));
// app.use(morgan('dev'));
app.use(express.json()) // принимать формат json
app.use('/api/post', postRouter) // создает адрес 
app.listen(PORT,()=>{
console.log('port listening ' + PORT) //прослушка порта и коллбек 

})

require('dns').lookup(require('os').hostname(), function (err, add, fam) {
    console.log('addr: '+add);
  })

