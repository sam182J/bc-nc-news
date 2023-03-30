const {
  fetchArticleById,
  fetchArticles,
  fetchArticleCommentsById,
  checkArticleExists,
  createArticleCommentById,
} = require("./ArticleModels");
const fetchTopics = require("./fetchTopics");
module.exports = {
  fetchTopics,
  fetchArticleById,
  fetchArticles,
  fetchArticleCommentsById,
  checkArticleExists,
  createArticleCommentById,
};
