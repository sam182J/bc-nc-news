const express = require("express");
const {
  getTopics,
  getArticleById,
  errorHandlerPSQL,
  errorHandlerCustom,
  getArticles,
  getArticleCommentsById,
  postArticleCommentById,
  patchArticleVotes,
  deleteCommentById,
  getUsers,
  getEndpoints,
} = require("./controllers");

const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getArticleCommentsById);
app.post("/api/articles/:article_id/comments", postArticleCommentById);
app.patch("/api/articles/:article_id", patchArticleVotes);
app.delete("/api/comments/:comment_id", deleteCommentById);
app.get("/api/users", getUsers);
app.get("/api", getEndpoints);

app.use(errorHandlerCustom);
app.use(errorHandlerPSQL);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Path not found!" });
});
module.exports = app;
