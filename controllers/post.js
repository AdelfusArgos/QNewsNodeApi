const Post = require("../models/post");
const FeaturedPost = require("../models/featuredPost");
const cloudinary = require("../cloudinary");
const FEATURE_POST_COUNT = 4;
const { isValidObjectId } = require("mongoose");
const post = require("../models/post");

const addToFeaturePost = async (postId) => {
  // добаить feature post
  const isAlreadyExsists = await FeaturedPost.findOne({ post: postId }); // нахождение одинакового поста со слагом

  if (isAlreadyExsists) return;

  const featuredPost = new FeaturedPost({
    post: postId,
  });

  await featuredPost.save();

  const featuredPosts = await FeaturedPost.find({}).sort({ createdAt: -1 }); // сортировка к последнего к старшему

  featuredPosts.forEach(async (post, index) => {
    if (index >= FEATURE_POST_COUNT)
      await FeaturedPost.findByIdAndDelete(post._id); // если постов больше чем 4  найти по айди и удалить
  });
};
const removeFromFeaturePost = async (postId) => {
  // удалить feature post

  await FeaturedPost.findOneAndDelete({ post: postId });
};

const isFeaturedPost = async (postId) => {
  // удалить feature post
  const post = await FeaturedPost.findOne({ post: postId });

  return post ? true : false;
};

exports.createPost = async (req, res) => {
  //создание поста
  //создание поста

  const { title, meta, content, slug, author, tags, featured } = req.body; //дааные передаются в этот объект
  const { file } = req; // изображение
  const newPost = new Post({
    title,
    meta,
    content,
    slug,
    author,
    tags,
    featured,
  });
  const isAlreadyExsists = await Post.findOne({ slug }); // нахождение одинакового поста со слагом

  if (isAlreadyExsists) {
    return res.status(401).json({ error: "Такой пост уже существует " }); //вернуть ошибку
  }

  if (file) {
    // проверка изображения
    const { secure_url: url, public_id } = await cloudinary.uploader.upload(
      file.path
    );
    newPost.thumbnail = { url, public_id };
  }

  await newPost.save();

  if (featured) await addToFeaturePost(newPost._id);

  res.json({
    post: {
      id: newPost._id,
      title,
      meta,
      slug,
      thumbnail: newPost.thumbnail?.url,
      author: newPost.author,
    },
  }); // вывод всего поста в формате json]{}
};

exports.deletePost = async (req, res) => {
  // удаление поста
  // айжи который указан в routers даст post айди в params
  const { postId } = req.params;

  if (!isValidObjectId(postId))
    return res.status(401).json({ error: "Невалидный запрос" }); // проверка на валидность айди

  const post = await Post.findById(postId);
  if (!post) return res.status(404).json({ error: "Пост не найден" }); // проверка на существование поста

  const public_id = post.thumbnail?.public_id; // проверка на изображение

  if (public_id) {
    const { result } = await cloudinary.uploader.destroy(public_id); // если есть изображение удалить и изображение из хостинга медиа

    if (result !== "ok")
      return res.status(404).json({ error: "ошибка при удалении изображения" });
  }

  await Post.findByIdAndDelete(postId);
  await removeFromFeaturePost(postId); // удаление из feature чтобы не было null
  res.json({ message: "Пост успешно удален" });
};

exports.updatePost = async (req, res) => {
  //обновление поста
  // обновление поста

  const { title, meta, content, slug, author, tags, featured } = req.body; //дааные передаются в этот объект
  const { file } = req; // изображение

  const { postId } = req.params;

  if (!isValidObjectId(postId))
    return res.status(401).json({ error: "Невалидный запрос" }); // проверка на валидность айди

  const post = await Post.findById(postId);
  if (!post) return res.status(404).json({ error: "Пост не найден" }); // проверка на существование поста

  const public_id = post.thumbnail?.public_id; // проверка на изображение

  if (public_id && file) {
    const { result } = await cloudinary.uploader.destroy(public_id); // если есть изображение удалить и изображение из хостинга медиа

    if (result !== "ok")
      return res.status(404).json({ error: "ошибка при удалении изображения" });
  }

  if (file) {
    // проверка изображения
    const { secure_url: url, public_id } = await cloudinary.uploader.upload(
      file.path
    );
    post.thumbnail = { url, public_id };
  }
  // обновление данных

  post.title = title;
  post.meta = meta;
  post.content = content;
  post.slug = slug;
  post.author = author;
  post.tags = tags;

  if (featured) await addToFeaturePost(post._id);
  else await removeFromFeaturePost();

  await post.save();

  res.json({
    post: {
      id: post._id,
      title,
      meta,
      slug,
      thumbnail: post.thumbnail?.url,
      author: post.author,
      content,
      featured,
    },
  }); // вывод всего поста в формате json]{}
};

exports.getPost = async (req, res) => {
  //получение одного поста
  // получение поста
  const { slug } = req.params;

  if (!slug) return res.status(401).json({ error: "Невалидный запрос" }); // проверка на валидность айди

  const post = await Post.findOne({ slug });
  if (!post) return res.status(404).json({ error: "Пост не найден" }); // проверка на существование поста

  const featured = await isFeaturedPost(post._id);

  const { title, meta, content, author, tags, createdAt } = post; //дааные передаются в этот объект

  res.json({
    post: {
      id: post._id,
      title,
      meta,
      slug,
      thumbnail: post.thumbnail?.url,
      author,
      content,
      tags,
      featured,
      createdAt,
    },
  }); // вывод всего поста в формате json]{}
};

exports.getFeaturedPosts = async (req, res) => {
  // получение поста
  const featuredPosts = await FeaturedPost.find({})
    .sort({ createdAt: -1 })
    .limit(4) // сортировка к последнего к старшему
    .populate("post");

  res.json({
    posts: featuredPosts.map(({ post }) => ({
      id: post._id,
      title: post.title,
      meta: post.meta,
      slug: post.slug,
      thumbnail: post.thumbnail?.url,
      author: post.author,
    })),
  });
}; // получение всех феатуред постов

exports.getPosts = async (req, res) => {
  // получение постов
  // получение поста
  const { pageNo = 0, limit = 10 } = req.query;

  const posts = await Post.find({})
    .sort({ createdAt: -1 })
    .skip(parseInt(pageNo) * parseInt(limit))
    .limit(parseInt(limit));

  res.json({
    posts: posts.map((post) => ({
      id: post._id,
      title: post.title,
      meta: post.meta,
      slug: post.slug,
      thumbnail: post.thumbnail?.url,
      author: post.author,
    })),
  });
}; // получение последних постов с 0 до 10 на скролл(или пагинацию в форме)

exports.searchPost = async (req, res) => {
  // поиск пока не работает
  const { title } = req.query;

  if (!title.trim())
    return res.status(401).json({ error: "значение поиска не найдено" });

  const posts = await Post.find({ title: { $regex: title, $options: "i" } });
  res.json({
    posts: posts.map((post) => ({
      id: post._id,
      title: post.title,
      meta: post.meta,
      slug: post.slug,
      thumbnail: post.thumbnail?.url,
      author: post.author,
    })),
  });
};

exports.relatedPosts = async (req, res) => {
  // поиск пока не работает

  const { postId } = req.params;
  if (!isValidObjectId(postId))
    return res.status(401).json({ error: "invalid req" });

  const post = await Post.findById(postId);
  if (!post) return res.status(404).json({ error: " Пост не найден" });

  const relatedPosts = await Post.find({
    tags: { $in: [...post.tags] },
    _id: { $ne: post._id },
  })
    .sort({ createdAt: -1 })
    .limit(5);

  res.json({
    posts: relatedPosts.map((post) => ({
      id: post._id,
      title: post.title,
      meta: post.meta,
      slug: post.slug,
      thumbnail: post.thumbnail?.url,
      author: post.author,
      tags: post.tags,
    })),
  });
};

exports.uploadImage = async (req, res) => {
  // для картинки в форме(пока не нужно)

  const { file } = req;

  if (!file) return res.status(401).json({ error: "image file is missing" });

  const { secure_url: url } = await cloudinary.uploader.upload(file.path);

  res.status(201).json({ image: url });
};
