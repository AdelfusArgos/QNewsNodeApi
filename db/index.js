const mongoose = require("mongoose"); // moongose для работы с mongodb
require('dotenv').config();
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("db connected"))
  .catch((err) => console.log("connection error", err.message || err)); //  подключение к mongodb

  console.log(process.env.MONGO_URL);