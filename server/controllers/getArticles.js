const {
  fetchArticleById,
  fetchArticles,
  fetchArticleCommentsById,
  checkArticleExists,
} = require("../models");

getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

getArticles = (req, res, next) => {
  fetchArticles().then((articles) => {
    res.status(200).send({ articles });
  });
};

getArticleCommentsById = (req, res, next) => {
  const { article_id } = req.params;

  fetchArticleCommentsById(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })

    .catch((err) => next(err));
};
module.exports = { getArticleById, getArticles, getArticleCommentsById };
