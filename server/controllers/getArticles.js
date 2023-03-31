const {
  fetchArticleById,
  fetchArticles,
  fetchArticleCommentsById,
  checkArticleExists,
  createArticleCommentById,
  editArticleVotes,
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
  const { topic, sort_by, order_by } = req.query;
  fetchArticles(topic, sort_by, order_by)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => next(err));
};

getArticleCommentsById = (req, res, next) => {
  const { article_id } = req.params;

  fetchArticleCommentsById(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })

    .catch((err) => next(err));
};

postArticleCommentById = (req, res, next) => {
  const { article_id } = req.params;
  const { body } = req;
  createArticleCommentById(article_id, body)
    .then((data) => {
      res.status(200).send({
        newComment: data,
      });
    })
    .catch((err) => {
      next(err);
    });
};
patchArticleVotes = (req, res, next) => {
  const { article_id } = req.params;
  const { body } = req;
  editArticleVotes(article_id, body)
    .then((data) => {
      res.status(200).send({
        updatedArticle: data,
      });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getArticleById,
  getArticles,
  getArticleCommentsById,
  postArticleCommentById,
  patchArticleVotes,
};
