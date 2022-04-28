// файл мартшрутов для загрузки данных с сервера

const router = require("express").Router(); //иммпорт и получение маршрута
const { createPost, deletePost,updatePost,getPost,getFeaturedPosts,getPosts,searchPost,relatedPosts,uploadImage} = require("../controllers/post");
const multer = require("../middlewares/multer");
const { parseData } = require("../middlewares/parseData");
const { postValidator, validate } = require("../middlewares/postValidator");

// router.post( // создать постnpm
//   "/create",
//   multer.single("thumbnail"),
//   parseData, 
//   postValidator,
//   validate,
//   createPost
// );


// router.put( // обновить пост
//   "/:postId",
//   multer.single("thumbnail"),
//   parseData, 
//   postValidator,
//   validate,
//   updatePost
// ); 


// router.delete("/:postId",deletePost);// удалить пост
router.get("/single/:slug",getPost);// запросить пост по его slug

router.get("/featured-posts",getFeaturedPosts);// запросить все актуальные посты
router.get("/posts",getPosts); // запросить все посты
router.get("/search",searchPost); // поиск по заголовку
router.get("/related-posts/:postId",relatedPosts); // последние посты

// router.post( // для картинки в форме(пока не нужно)
//   "/upload-Image",
//   multer.single("image"),
//   uploadImage
// ); 



module.exports = router; // экспорт

