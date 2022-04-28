// фильтрация для картинок 


const multer = require('multer');
const storage = multer.diskStorage({}) // изображение будет в внутреннем хранилище

const fileFilter = (req,file,cb) =>{

    if(!file.mimetype.includes('image')){ // валидация изображени
        return cb("Невалидный формат изображения",null)
    }
    cb(null,true) // для взятия объекта
    console.log(file);
}



module.exports = multer({storage,fileFilter});