// файл модели отправки сообщений cхема хранения данных

const moongose = require('mongoose');

const postSchema = moongose.Schema({
    title:{
        type:String,
        required:true,
        trim:true
    },

    slug:{ // 
        type:String,
        required:true,
        trim:true,
        unique:true // хранить только уникальный айди
    },
    content:{
        type:String,
        required:true,
        trim:true

    },
    meta:{
        type:String,
        required:true,
        trim:true

    },
    tags:[String],
    author:{
        type:String,
        default:'Admin',
    },
    thumbnail:{ // картинка
        type:Object,
        url:{
            type:URL,
          
        },
        public_id:{
            type:String,
        
        }
    },
},{
    timestamps:true // время создания или обновления 
})

module.exports = moongose.model('Post',postSchema) 