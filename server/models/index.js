const {
  fetchArticleById,
  fetchArticles,
  fetchArticleCommentsById,
  checkArticleExists,
  createArticleCommentById,
  editArticleVotes,
} = require("./ArticleModels");
const fetchTopics = require("./fetchTopics");
const removeCommentById = require("./commentModels");
module.exports = {
  fetchTopics,
  fetchArticleById,
  fetchArticles,
  fetchArticleCommentsById,
  checkArticleExists,
  createArticleCommentById,
  editArticleVotes,
  removeCommentById,
};
