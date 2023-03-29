const {
  fetchArticleById,
  fetchArticles,
  fetchArticleCommentsById,
  checkArticleExists,
} = require("./fetchArticles");
const fetchTopics = require("./fetchTopics");
module.exports = {
  fetchTopics,
  fetchArticleById,
  fetchArticles,
  fetchArticleCommentsById,
  checkArticleExists,
};
