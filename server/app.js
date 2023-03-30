const express = require("express");
const {
  getTopics,
  getArticleById,
  errorHandlerPSQL,
  errorHandlerCustom,
  getArticles,
  getArticleCommentsById,
  postArticleCommentById,
} = require("./controllers");

const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getArticleCommentsById);
app.post("/api/articles/:article_id/comments", postArticleCommentById);
app.use(errorHandlerCustom);
app.use(errorHandlerPSQL);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Path not found!" });
});
module.exports = app;
