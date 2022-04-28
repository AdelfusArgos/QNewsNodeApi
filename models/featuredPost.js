
const moongose = require('mongoose');

const featurePostSchema = moongose.Schema({
  post:{
      type:moongose.Schema.Types.ObjectId,
      ref:'Post', // берем пост из post.js
      require:true,
  }
},{
    timestamps:true // время создания или обновления 
})

module.exports = moongose.model('FeaturedPost',featurePostSchema) 