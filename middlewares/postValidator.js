// Валидация данных с поста

const { check, validationResult } = require("express-validator");

exports.postValidator = [
  check("title").trim().not().isEmpty().withMessage("Заголовок пуст"),
  check("content").trim().not().isEmpty().withMessage("Контент пуст"),
  check("meta").trim().not().isEmpty().withMessage("Мета описание пусто"),
  check("slug").trim().not().isEmpty().withMessage("айди url пусто"),

  check("tags")
    .isArray()
    .withMessage("теги должны быть строками в массиве")

    .custom((tags) => {
      for (let t of tags) {
        if (typeof t !== "string") {
          throw Error("теги должны быть строками в массиве");
        }
      }

      return true;
    }),
];

exports.validate = (req, res, next) => {  //проверка если есть ошибки выводим ошибку если нет переходим к следующему методу(контроллеру)
  const error = validationResult(req).array();
  if(error.length){
  return  res.status(401).json({error})
  } 
  next()
};
